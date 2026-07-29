import Image from 'next/image';
import Link from 'next/link';

import { offices, services, site } from '@/lib/site';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-navy text-white/75">
      <div className="container-page grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="relative h-12 w-[220px]">
            <Image src="/images/logo.png" alt={site.name} fill className="object-contain object-left" />
          </div>
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed">
            En People and Point creemos que el éxito de una empresa comienza con la eficiencia de sus procesos y el
            bienestar de su gente.
          </p>
          <Link href="/privacy-policy" className="mt-6 inline-block text-[15px] text-gold hover:underline">
            Política de privacidad
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Ubicaciones</h2>
          <ul className="mt-6 space-y-4 text-[15px] leading-relaxed">
            {offices.map((office) => (
              <li key={office.city}>
                <span className="block font-semibold text-white">{office.city}</span>
                {office.address}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Servicios</h2>
          <ul className="mt-6 space-y-3 text-[15px]">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/${service.slug}`} className="transition hover:text-gold">
                  {service.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Compañía</h2>
          <ul className="mt-6 space-y-3 text-[15px]">
            <li>
              <Link href="/about" className="transition hover:text-gold">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-gold">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/terminos-y-condiciones-del-servicio" className="transition hover:text-gold">
                Términos y condiciones
              </Link>
            </li>
          </ul>

          <h2 className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-white">Contacto</h2>
          <ul className="mt-6 space-y-3 text-[15px]">
            <li>
              <a href={`mailto:${site.email}`} className="transition hover:text-gold">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneHref}`} className="transition hover:text-gold">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
