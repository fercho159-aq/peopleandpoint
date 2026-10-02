'use client';

import { useEffect, useRef, useState } from 'react';

import { trackVideoSound } from '@/lib/analytics';

const VIDEO_TITLE = 'Video institucional de People and Point';

const SOURCES = {
  mobile: '/video/people-and-point-720.mp4',
  desktop: '/video/people-and-point-1080.mp4',
} as const;

/**
 * Video de portada. Arranca en silencio y en loop (los navegadores solo
 * permiten autoplay sin sonido; los subtítulos van quemados en el video, así
 * que se entiende sin audio). El botón de sonido lo reinicia desde el inicio
 * para que quien lo active vea la pieza completa.
 *
 * No se reproduce solo si el visitante pidió menos movimiento o ahorro de
 * datos, y se pausa al salir de pantalla para no gastar CPU ni batería.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const userPausedRef = useRef<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(true);
  // Solo se muestra cuando el video no arrancó solo; así no parpadea mientras carga el autoplay.
  const [needsPlay, setNeedsPlay] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React no serializa `muted` como atributo en SSR; sin esto el autoplay falla.
    video.muted = true;
    // La fuente se elige aquí y no con <source media>, que no todos los navegadores respetan:
    // el celular baja la versión de 6 MB en lugar de la de 13 MB.
    video.src = window.matchMedia('(max-width: 767px)').matches ? SOURCES.mobile : SOURCES.desktop;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reducedMotion || connection?.saveData) {
      userPausedRef.current = true;
      setNeedsPlay(true);
      return;
    }

    video.play().catch(() => {
      // Autoplay bloqueado (p. ej. modo de bajo consumo en iOS): queda el póster con el botón de play.
      setNeedsPlay(true);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) video.pause();
        else if (!userPausedRef.current) video.play().catch(() => undefined);
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = (): void => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => undefined);
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  const toggleSound = (): void => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.currentTime = 0;
      video.muted = false;
      userPausedRef.current = false;
      video.play().catch(() => undefined);
      trackVideoSound();
    } else {
      video.muted = true;
    }
  };

  return (
    <div className="relative aspect-video max-h-[calc(100svh-80px)] w-full overflow-hidden bg-navy-dark md:max-h-[calc(100svh-148px)]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/video/people-and-point-poster.jpg"
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={VIDEO_TITLE}
        onPlay={() => {
          setPlaying(true);
          setNeedsPlay(false);
        }}
        onPause={() => setPlaying(false)}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
      />

      {needsPlay && !playing ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center bg-navy-dark/30 transition hover:bg-navy-dark/20"
          aria-label={`Reproducir ${VIDEO_TITLE.toLowerCase()}`}
        >
          <span className="grid size-16 place-items-center rounded-full bg-gold text-white shadow-float md:size-20">
            <PlayIcon className="ml-1 size-7 md:size-8" />
          </span>
        </button>
      ) : null}

      {/* Abajo a la izquierda: la esquina derecha la ocupa el botón flotante de WhatsApp y el centro, los subtítulos. */}
      <div className="pointer-events-none absolute bottom-0 left-0 flex items-center gap-2 p-3 md:p-6">
        <button
          type="button"
          onClick={togglePlay}
          className={controlClass}
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
        >
          {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          className={`${controlClass} gap-2 sm:px-4`}
          aria-label={muted ? 'Ver el video con sonido desde el inicio' : 'Silenciar video'}
        >
          {muted ? <SoundOffIcon className="size-4" /> : <SoundOnIcon className="size-4" />}
          <span className="hidden text-[13px] font-semibold sm:inline">{muted ? 'Ver con sonido' : 'Silenciar'}</span>
        </button>
      </div>
    </div>
  );
}

const controlClass =
  'pointer-events-auto inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-navy-dark/70 px-2.5 text-white backdrop-blur-sm transition hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:h-11 md:min-w-11';

function PlayIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function SoundOffIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
      <path d="m23 9-6 6M17 9l6 6" strokeLinecap="round" />
    </svg>
  );
}

function SoundOnIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" strokeLinecap="round" />
    </svg>
  );
}
