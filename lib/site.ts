export type NavLink = {
  readonly label: string;
  readonly href: string;
};

export type Service = {
  readonly slug: string;
  readonly navLabel: string;
  readonly title: string;
  readonly summary: string;
  readonly body: string;
  readonly differentiator: string;
  readonly image: string;
};

export type Office = {
  readonly city: string;
  readonly address: string;
};

export type Faq = {
  readonly question: string;
  readonly answer: string;
};

export type Value = {
  readonly name: string;
  readonly description: string;
};

export type Pillar = {
  readonly title: string;
  readonly image: string;
};

export type TeamMember = {
  readonly name: string;
  readonly role: string;
};

export const site = {
  name: 'People and Point',
  tagline: 'Talento en evolución',
  description:
    'Soluciones integrales de nómina, contabilidad, seguridad social y capacitación que impulsan el crecimiento real de tu empresa.',
  email: 'contacto@peopleandpoint.com',
  phone: '+52 56 6971 3268',
  phoneHref: '+525669713268',
  whatsappHref: 'https://wa.me/525669713268',
  url: 'https://peopleandpoint.com',
} as const;

export const offices: readonly Office[] = [
  { city: 'Ciudad de México', address: 'Gral. Salvador Alvarado, Col. Escandón, Alcaldía Miguel Hidalgo.' },
  { city: 'Guadalajara', address: 'Av. Tepeyac, Jardines Tepeyac, Zapopan, Jalisco.' },
  { city: 'Monterrey', address: 'Isaac Garza Oriente, Barrio de la Luz, Centro de Monterrey.' },
];

export const services: readonly Service[] = [
  {
    slug: 'maquila-de-nomina',
    navLabel: 'Payrolling / Maquila de Nómina',
    title: 'Payrolling / Maquila de Nómina',
    summary:
      'Servicio integral de maquila de nómina que asegura precisión en cálculos, cumplimiento fiscal y legal, generación de reportes estratégicos y atención personalizada.',
    body: 'En People and Point entendemos que una nómina bien gestionada es esencial para mantener la confianza, la estabilidad y el cumplimiento dentro de cualquier organización. Por eso, ofrecemos un servicio integral de maquila de nómina, operado bajo el registro patronal de tu empresa, que garantiza procesos eficientes, cálculos precisos y cumplimiento normativo en todo momento. Nos encargamos de que cada pago, impuesto y obligación patronal se gestione de forma correcta y puntual, brindándote tranquilidad, transparencia y control total sobre tu operación.',
    differentiator:
      'Combinamos precisión tecnológica con atención humana personalizada, garantizando cumplimiento total y acompañamiento continuo en cada proceso de nómina.',
    image: '/images/maquila-de-nomina.jpg',
  },
  {
    slug: 'servicios-especializados-repse',
    navLabel: 'Servicios Especializados REPSE',
    title: 'Servicios Especializados REPSE',
    summary:
      'Soluciones integrales que centralizan múltiples servicios estratégicos para empresas en un solo proveedor.',
    body: 'Operamos bajo el Registro de Prestadoras de Servicios Especializados u Obras Especializadas (REPSE), cumpliendo con cada requisito que la reforma laboral exige. Centralizamos servicios estratégicos en un solo proveedor para que tu empresa reduzca proveedores, trámites y riesgos, manteniendo la trazabilidad documental y el cumplimiento ante IMSS, INFONAVIT y SAT.',
    differentiator:
      'Ofrecemos un modelo único de proveedor múltiple que centraliza servicios estratégicos, reduciendo tiempos, costos y complejidad operativa sin perder calidad ni control.',
    image: '/images/servicios-especializados.jpg',
  },
  {
    slug: 'monedero-digital',
    navLabel: 'Monedero Digital',
    title: 'Monedero Digital',
    summary:
      'Solución integral para la dispersión de viáticos, gastos operativos y administración de recursos mediante tarjetas de débito físicas y virtuales respaldadas por MasterCard.',
    body: 'El Monedero Digital de People and Point es una solución integral para la gestión de viáticos, gastos operativos y recursos empresariales, diseñada para optimizar la administración financiera dentro de tu organización. Con esta herramienta, tu empresa puede agilizar procesos, reducir riesgos, garantizar el cumplimiento fiscal y ofrecer a sus colaboradores una experiencia moderna, segura y eficiente en el manejo de recursos.',
    differentiator:
      'Integramos tecnología financiera y control fiscal en una sola plataforma que brinda transparencia, trazabilidad y autonomía operativa en tiempo real.',
    image: '/images/monedero-digital.jpg',
  },
  {
    slug: 'contabilidad',
    navLabel: 'Contabilidad',
    title: 'Contabilidad',
    summary:
      'Servicio contable integral y estratégico diseñado para asegurar el cumplimiento fiscal y laboral, generar información financiera clara y accesible, y transformar la contabilidad en una herramienta para la toma de decisiones inteligentes.',
    body: 'En People and Point ofrecemos un servicio contable integral diseñado para garantizar el cumplimiento fiscal y laboral, generar información financiera clara, precisa y accesible, y convertir la contabilidad en una herramienta estratégica para la toma de decisiones inteligentes. Nuestro enfoque combina cumplimiento normativo, análisis financiero y visión estratégica, ayudando a las empresas a optimizar recursos, fortalecer su gestión y alcanzar un crecimiento sostenible.',
    differentiator:
      'Convertimos la contabilidad en una herramienta de decisión, combinando cumplimiento fiscal con análisis estratégico para impulsar la rentabilidad del negocio.',
    image: '/images/contabilidad.jpg',
  },
  {
    slug: 'gestion-integral-de-seguridad-social-y-pensiones-imss',
    navLabel: 'Gestión Integral de Seguridad Social (IMSS)',
    title: 'Gestión de Seguridad Social Integral (IMSS)',
    summary:
      'Servicio especializado en asesoría y gestión de trámites ante el IMSS con procesos precisos y totalmente alineados a la normativa vigente.',
    body: 'En People and Point ofrecemos soluciones integrales para la administración y cumplimiento de tus obligaciones ante el Instituto Mexicano del Seguro Social (IMSS), asegurando procesos precisos, oportunos y totalmente alineados con la normativa vigente. Nos encargamos de la gestión completa de trámites, incluyendo altas y bajas de registros patronales, modificación de domicilio o representante legal, aclaración de prima de riesgo, asesoría especializada y procesos de regularización. Garantizamos una administración eficiente que brinda tranquilidad, cumplimiento y control total sobre tus obligaciones en materia de seguridad social.',
    differentiator:
      'Acompañamiento experto y personalizado en cada trámite, con tiempos optimizados y un enfoque de solución total que garantiza cumplimiento y tranquilidad.',
    image: '/images/GESTION-INTEGRAL-DE-SEGURIDAD-SOCIAL-Y-PENSIONES-IMSS.jpg',
  },
  {
    slug: 'punto-de-venta',
    navLabel: 'Punto de Venta',
    title: 'Punto de Venta',
    summary: 'Impulsamos tu marca con soluciones creativas y funcionales que generan identidad y presencia.',
    body: 'En People and Point ayudamos a las empresas a proyectar una imagen sólida y memorable, a través de estrategias que combinan diseño, comunicación y experiencia de marca. Desarrollamos soluciones personalizadas que fortalecen tu identidad corporativa y generan conexión con tus clientes: desde merchandising y uniformes, hasta campañas de visibilidad, diseño estratégico e inventarios promocionales.',
    differentiator:
      'Diseñamos experiencias de marca en el punto de venta, no solo materiales; creamos soluciones que impulsan visibilidad, recordación y decisión de compra.',
    image: '/images/PUNTO-DE-VENTA.jpg',
  },
  {
    slug: 'capacitaciones-empresariales',
    navLabel: 'Capacitaciones Empresariales',
    title: 'Capacitaciones Empresariales',
    summary:
      'Programas de capacitación diseñados para transformar el conocimiento en práctica real dentro de la empresa.',
    body: 'En People and Point diseñamos programas de capacitación que transforman el conocimiento en resultados reales dentro de la empresa. Nuestros cursos y talleres están enfocados en desarrollar habilidades prácticas y aplicables de inmediato, cumpliendo con las normativas vigentes, como la NOM-035, y fortaleciendo la integración y el bienestar organizacional. Impulsa el crecimiento de tu equipo y convierte el aprendizaje en una ventaja competitiva que eleva la productividad, conciencia y competitividad de tu empresa.',
    differentiator:
      'Nuestros programas están diseñados desde la práctica real, asegurando que el aprendizaje se traduzca en resultados medibles y mejoras inmediatas en el desempeño del equipo.',
    image: '/images/capacitacion-.jpg',
  },
];

export const navLinks: readonly NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/about' },
];

export const faqs: readonly Faq[] = [
  {
    question: '¿Qué tan seguro es confiar mi nómina o contabilidad a un proveedor externo?',
    answer:
      'En People and Point trabajamos bajo estrictos protocolos de confidencialidad y cumplimiento fiscal. Utilizamos plataformas seguras y procesos auditables que garantizan control total, transparencia y protección de la información.',
  },
  {
    question: '¿Y si mi empresa es pequeña o está creciendo, puedo contratar sus servicios?',
    answer:
      'Claro que sí. Nuestras soluciones son 100 % escalables. Acompañamos desde startups hasta corporativos consolidados, adaptando cada servicio al tamaño, ritmo y presupuesto de tu empresa.',
  },
  {
    question: '¿Cuánto tiempo toma ver resultados al contratar sus servicios?',
    answer:
      'Desde el primer mes notarás cambios medibles: reducción de carga operativa, cumplimiento fiscal automatizado y una administración más clara y eficiente.',
  },
];

export const pillars: readonly Pillar[] = [
  { title: 'Estrategia', image: '/images/img-4.jpg' },
  { title: 'Asesoría', image: '/images/img-5.jpg' },
  { title: 'Medición', image: '/images/img-6.jpg' },
  { title: 'Formación constante', image: '/images/capacitacion-.jpg' },
];

export const values: readonly Value[] = [
  {
    name: 'Colaboración',
    description:
      'Fomentamos la inteligencia colectiva y el trabajo en red, valorando tanto el talento de nuestros colaboradores como los resultados alcanzados en conjunto.',
  },
  {
    name: 'Evolución',
    description:
      'Nos mantenemos en constante evolución, adaptándonos al cambio con flexibilidad y aprendiendo de cada experiencia.',
  },
  {
    name: 'Valentía',
    description:
      'Nos atrevemos a proponer ideas y soluciones que otros no se atreven, enfrentando retos con determinación.',
  },
  {
    name: 'Transparencia',
    description: 'Actuamos con claridad, ética y honestidad en todas nuestras decisiones y relaciones.',
  },
  {
    name: 'Creatividad',
    description:
      'Diseñamos soluciones originales e innovadoras que aportan valor real a nuestros clientes y colaboradores.',
  },
  {
    name: 'Servicio',
    description:
      'Ponemos a nuestros clientes en el centro de todo lo que hacemos, asumiendo sus objetivos como propios y construyendo relaciones de confianza a largo plazo.',
  },
];

export const team: readonly TeamMember[] = [
  { name: 'Marta', role: 'CEO' },
  { name: 'Enrique', role: 'CTO' },
  { name: 'Pablo', role: 'Dirección de operaciones' },
];

export function findService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
