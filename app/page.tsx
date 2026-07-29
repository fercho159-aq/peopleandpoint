import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ContactForm } from '@/components/contact-form';
import { FaqAccordion } from '@/components/faq-accordion';
import { JsonLdScript } from '@/components/json-ld';
import { CtaButton, Section, SectionHeading } from '@/components/ui';
import { faqJsonLd } from '@/lib/seo';
import { faqs, services, site } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'Maquila de nómina, REPSE y gestión de capital humano | People and Point',
  },
  description:
    'Maquila de nómina, servicios especializados REPSE, monedero digital, contabilidad, IMSS, punto de venta y capacitación empresarial. 15+ años optimizando procesos de capital humano en CDMX, Guadalajara y Monterrey.',
  alternates: { canonical: '/' },
};

const highlights = [
  {
    title: 'Maquila de Nómina',
    text: 'En People and Point entendemos que una nómina bien gestionada es esencial para mantener la confianza, la estabilidad y el cumplimiento dentro de cualquier organización.',
    href: '/maquila-de-nomina',
  },
  {
    title: 'Monedero Digital',
    text: 'Solución integral para la administración de viáticos y gastos operativos mediante tarjetas físicas y virtuales.',
    href: '/monedero-digital',
  },
  {
    title: 'Punto de Venta',
    text: 'Fortalece tu marca con artículos y campañas personalizadas que reflejan identidad, coherencia y presencia profesional.',
    href: '/punto-de-venta',
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={[faqJsonLd()]} />
      <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden bg-navy pt-40 pb-24">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-30" />
        <div className="-z-10 absolute inset-0 bg-linear-to-b from-navy via-navy/85 to-navy/95" />
        <div className="container-page text-center">
          <h1 className="mx-auto max-w-4xl text-4xl text-white md:text-[64px]">
            ¿Tu nómina y administración te hacen perder tiempo?
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/85">
            Cada día que tu empresa invierte en tareas operativas, pierde oportunidades de crecimiento, eficiencia y
            desarrollo de talento.
          </p>
          <div className="mt-10">
            <CtaButton href="/contact">Obtén asesoría</CtaButton>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div className="lg:pt-6">
            <p className="eyebrow">{site.name}</p>
            <h2 className="mt-4 text-3xl md:text-[46px]">15+ años optimizando procesos de capital humano</h2>
            <p className="mt-6 text-[17px] leading-relaxed">
              Ofrecemos soluciones integrales para transformar tu administración, contabilidad, nómina y capacitación en
              motores de crecimiento sostenibles.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Cumplimiento normativo garantizado', 'Procesos auditables y transparentes', 'Soluciones 100 % escalables', 'Acompañamiento humano cercano'].map(
                (item) => (
                  <p key={item} className="flex items-start gap-3 text-[15px] font-medium text-navy">
                    <span aria-hidden className="mt-1 text-gold">
                      ◆
                    </span>
                    {item}
                  </p>
                ),
              )}
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>

      <Section id="servicios" className="bg-cream">
        <SectionHeading
          title="Soluciones integrales que impulsan el crecimiento real de tu empresa"
          intro="En People and Point convertimos la gestión operativa en una ventaja competitiva. Diseñamos soluciones estratégicas que combinan tecnología, precisión y acompañamiento humano para garantizar eficiencia, cumplimiento y resultados medibles. Sea cual sea el tamaño de tu organización, nuestros servicios se adaptan a tus necesidades, ayudándote a optimizar recursos, reducir costos y potenciar a tu equipo."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-xl">{service.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed">{service.summary}</p>
                <Link
                  href={`/${service.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-gold transition hover:gap-3"
                >
                  Ir al servicio
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Servicios Top"
          title="Transforma tu talento en resultados medibles"
          intro="Nuestras soluciones integrales están pensadas para impulsar a las empresas que buscan trascender."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {highlights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-xl border border-navy/10 p-8 transition hover:border-gold hover:shadow-card"
            >
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed">{item.text}</p>
              <span className="mt-6 inline-block text-[15px] font-bold text-gold">Conocer más →</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-cream">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            align="left"
            title="Preguntas que transforman dudas en decisiones"
            intro="Sabemos que delegar procesos tan sensibles como la nómina, la contabilidad o la gestión de talento no es una decisión fácil. Por eso, en People and Point priorizamos la claridad, la confianza y el acompañamiento humano desde el primer contacto."
          />
          <FaqAccordion items={faqs} />
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-xl shadow-card">
            <Image
              src="/images/elige-servicio-1.jpg"
              alt="Equipo de People and Point asesorando a una empresa"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Elige tu siguiente paso</p>
            <h2 className="mt-4 text-3xl md:text-[42px]">Elige el servicio que llevará tu empresa al siguiente nivel</h2>
            <p className="mt-6 text-[17px] leading-relaxed">
              Desde la nómina hasta la contabilidad, desde la capacitación hasta la seguridad social: en People and
              Point reunimos todos los procesos clave de tu negocio bajo un mismo aliado estratégico. Con tecnología,
              cumplimiento y atención personalizada, optimizamos cada detalle para que tu empresa crezca con seguridad y
              control total.
            </p>
            <div className="mt-8">
              <CtaButton href="/contact">Obtén asesoría</CtaButton>
            </div>
          </div>
        </div>
      </Section>

      <section className="relative isolate overflow-hidden bg-navy py-24 md:py-32">
        <Image src="/images/testimonials-bg.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-20" />
        <div className="container-page max-w-4xl text-center">
          <p className="eyebrow">Testimonios</p>
          <blockquote className="mt-8 text-lg leading-relaxed text-white/90 md:text-xl">
            «Trabajar con People &amp; Point ha sido un antes y un después para mi empresa. Antes me ahogaba entre
            procesos, nóminas y capacitaciones, pero ahora todo está organizado, cumpliendo con la normativa y, lo más
            importante, mi equipo se siente respaldado y motivado. No solo mejoramos nuestra productividad, sino que
            también conseguimos tranquilidad y confianza en cada decisión.»
          </blockquote>
          <p className="mt-8 font-bold text-gold">Empresa de Construcción</p>
        </div>
      </section>

      <Section className="bg-cream">
        <div className="rounded-2xl bg-navy px-8 py-14 text-center md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl text-white md:text-[40px]">
            Mientras tú lo piensas, otros ya están avanzando.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/80">
            Agenda una asesoría sin costo y descubre cuánto tiempo y presupuesto puede recuperar tu operación.
          </p>
          <div className="mt-9">
            <CtaButton href="/contact">Obtén asesoría</CtaButton>
          </div>
        </div>
      </Section>
    </>
  );
}
