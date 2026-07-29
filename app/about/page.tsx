import type { Metadata } from 'next';
import Image from 'next/image';

import { CtaButton, PageHero, Section, SectionHeading } from '@/components/ui';
import { pillars, team, values } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Más que un proveedor, somos un aliado estratégico que transforma la administración del capital humano en un motor de rentabilidad y crecimiento sostenible.',
};

const purpose = [
  {
    label: 'Misión',
    text: 'Transformamos marcas y personas en experiencias que trascienden. Diseñamos soluciones estratégicas que refuerzan la identidad corporativa, mientras potenciamos el desarrollo del talento a través de su gestión. Nuestro propósito es crecer junto a nuestros clientes y colaboradores, dejando huella en cada proyecto.',
  },
  {
    label: 'Visión',
    text: 'Ser reconocidos en México como la mejor alternativa en gestión del talento y soluciones estratégicas, contribuyendo al desarrollo de las empresas y al crecimiento de nuestros colaboradores, actuando con valores y generando impacto sostenible.',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="¿Qué nos hace diferentes?"
        intro="En People and Point creemos que el éxito de una empresa comienza con la eficiencia de sus procesos y el bienestar de su gente."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <SectionHeading align="left" eyebrow="Nuestro enfoque" title="Más que un proveedor, un aliado estratégico" />
          <div className="space-y-5 text-[17px] leading-relaxed">
            <p>
              Ofrecemos soluciones personalizadas e innovadoras que simplifican y optimizan la gestión administrativa,
              contable y de nómina, ayudando a nuestros clientes a ahorrar tiempo, reducir costos operativos y garantizar
              cumplimiento normativo.
            </p>
            <p>
              Más que un proveedor, somos un aliado estratégico que transforma la administración del capital humano en un
              motor de rentabilidad, productividad y crecimiento sostenible.
            </p>
            <p>
              Nuestro enfoque se basa en la precisión, la claridad y la atención personalizada, impulsando a las
              organizaciones a alcanzar su máximo potencial mediante resultados reales, medibles y adaptados a cada
              necesidad.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="group relative overflow-hidden rounded-xl">
              <div className="relative aspect-4/5">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy/90 to-navy/10" />
              </div>
              <h3 className="absolute inset-x-0 bottom-0 p-6 text-xl text-white">{pillar.title}</h3>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-cream">
        <SectionHeading
          title="Nuestro propósito impulsa cada conexión"
          intro="En People &amp; Point creemos que el verdadero éxito empresarial nace de las personas. Nuestra misión, visión y valores son la brújula que guía cada proyecto, cada alianza y cada decisión."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {purpose.map((item) => (
            <article key={item.label} className="rounded-xl bg-white p-9 shadow-card">
              <p className="eyebrow">{item.label}</p>
              <p className="mt-5 text-[17px] leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <article key={value.name} className="rounded-xl border border-navy/10 bg-white/60 p-7">
              <h3 className="text-lg">{value.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed">{value.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Personas que inspiran resultados"
          intro="Detrás de cada estrategia, hay un equipo comprometido con impulsar el crecimiento humano y organizacional. Creemos en el trabajo colaborativo, en la empatía y en la excelencia como motor de transformación."
        />
        <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
          {team.map((member) => (
            <article key={member.name} className="rounded-xl bg-cream p-8 text-center">
              <div
                aria-hidden
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white"
              >
                {member.name.charAt(0)}
              </div>
              <h3 className="mt-5 text-lg">{member.name}</h3>
              <p className="mt-1 text-[15px] text-gold">{member.role}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-navy">
        <div className="text-center">
          <h2 className="mx-auto max-w-2xl text-3xl text-white md:text-[40px]">
            Mientras tú lo piensas, otros ya están avanzando.
          </h2>
          <div className="mt-9">
            <CtaButton href="/contact">Obtén asesoría</CtaButton>
          </div>
        </div>
      </Section>
    </>
  );
}
