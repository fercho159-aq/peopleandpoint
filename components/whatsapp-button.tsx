import { site } from '@/lib/site';

export function WhatsAppButton() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-float transition hover:scale-105"
    >
      <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.9a8 8 0 1 1-4.1 14.86l-.3-.18-3.08.9.9-3-.2-.31A8 8 0 0 1 12.05 3.9Zm4.6 10.1c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.16 1.74 2.66 4.22 3.73.59.25 1.05.4 1.4.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.3Z" />
      </svg>
    </a>
  );
}
