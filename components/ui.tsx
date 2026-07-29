import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  tone = 'light',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
}) {
  const isCenter = align === 'center';
  return (
    <div className={`${isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={`mt-4 text-3xl md:text-[42px] ${tone === 'dark' ? 'text-white' : ''}`}>{title}</h2>
      {intro ? (
        <p className={`mt-6 text-[17px] leading-relaxed ${tone === 'dark' ? 'text-white/80' : 'text-ink'}`}>{intro}</p>
      ) : null}
    </div>
  );
}

export function CtaButton({
  href,
  children,
  variant = 'gold',
}: {
  href: string;
  children: ReactNode;
  variant?: 'gold' | 'outline';
}) {
  const base = 'inline-block rounded px-9 py-4 text-[15px] font-bold transition';
  const styles =
    variant === 'gold'
      ? 'bg-gold text-white hover:bg-gold-dark shadow-card'
      : 'border border-white/40 text-white hover:border-gold hover:text-gold';
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image = '/images/page-hero.jpg',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pb-20 pt-40 md:pb-28 md:pt-56">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-25" />
      <div className="-z-10 absolute inset-0 bg-linear-115 from-navy via-navy/95 to-navy/70" />
      <div className="container-page max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-4 text-4xl text-white md:text-[56px]">{title}</h1>
        {intro ? <p className="mt-6 text-lg leading-relaxed text-white/85">{intro}</p> : null}
      </div>
    </section>
  );
}
