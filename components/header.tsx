'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { navLinks, services, site } from '@/lib/site';

export function Header() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      const node = dropdownRef.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) {
        setServicesOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isServiceRoute = services.some((service) => pathname === `/${service.slug}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="hidden bg-navy-dark text-[13px] text-white/80 md:block">
        <div className="container-page flex h-11 items-center gap-4">
          <a className="inline-flex items-center gap-2 transition hover:text-gold" href={`mailto:${site.email}`}>
            <MailIcon />
            {site.email}
          </a>
          <span aria-hidden className="text-white/30">
            |
          </span>
          <a className="inline-flex items-center gap-2 transition hover:text-gold" href={`tel:${site.phoneHref}`}>
            <PhoneIcon />
            {site.phone}
          </a>
        </div>
      </div>

      <div
        className={`bg-navy transition-shadow duration-300 ${scrolled || mobileOpen ? 'shadow-lg' : ''}`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6 md:h-[104px]">
          <Link href="/" className="relative block h-12 w-[220px] shrink-0" aria-label={`${site.name} — inicio`}>
            <Image src="/images/logo.png" alt={site.name} fill priority className="object-contain object-left" />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9 font-medium text-white">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition hover:text-gold ${pathname === link.href ? 'text-gold' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={() => setServicesOpen((open) => !open)}
                  className={`inline-flex items-center gap-2 transition hover:text-gold ${
                    isServiceRoute ? 'text-gold' : ''
                  }`}
                >
                  Nuestros Servicios
                  <ChevronIcon open={servicesOpen} />
                </button>
                {servicesOpen ? (
                  <ul className="absolute left-0 top-full z-50 mt-4 w-[320px] overflow-hidden rounded-lg bg-white py-2 shadow-float">
                    {services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/${service.slug}`}
                          className="block px-5 py-3 text-[15px] leading-snug text-navy transition hover:bg-cream hover:text-gold"
                        >
                          {service.navLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded bg-gold px-8 py-4 text-[15px] font-bold text-white shadow-card transition hover:bg-gold-dark md:inline-block"
            >
              Contacto
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded text-white lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="menu-movil"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span className="sr-only">Menú</span>
              <BurgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div id="menu-movil" className="border-t border-white/10 bg-navy pb-6 lg:hidden">
            <nav aria-label="Móvil" className="container-page pt-4">
              <ul className="space-y-1 text-white">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-2 font-medium transition hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">Nuestros servicios</li>
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/${service.slug}`} className="block py-2 text-[15px] text-white/85 hover:text-gold">
                      {service.navLabel}
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-block rounded bg-gold px-6 py-3 font-bold text-white transition hover:bg-gold-dark"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v.3l-10 5.6-10-5.6v-.3Zm0 2.6V18.5A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.5-1.5V8.1l-9.5 5.3a1 1 0 0 1-1 0L2 8.1Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.2 21 3 12.8 3 2.9a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1l-2.2 2.4Z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M12 15.5 4.5 8l1.4-1.4L12 12.7l6.1-6.1L19.5 8 12 15.5Z" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {open ? (
        <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      )}
    </svg>
  );
}
