/**
 * Identificadores de medición migrados del WordPress anterior (leídos del HTML
 * en producción antes del corte). Son públicos por naturaleza: viajan en el
 * HTML del cliente, así que viven aquí y no en variables de entorno.
 */
export const analytics = {
  /**
   * El sitio viejo cargaba dos propiedades de GA4 a la vez. Se conservan ambas
   * para no cortar el histórico de ninguna, pero conviene consolidar en una:
   * mientras las dos estén activas, cada visita se cuenta por duplicado.
   */
  ga4Ids: ['G-WV3SF851Q1', 'G-DYC8V4JHBQ'] as const,
  metaPixelId: '1544855447168376',
} as const;

type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    gtag?: (...args: readonly unknown[]) => void;
    fbq?: (...args: readonly unknown[]) => void;
  }
}

/**
 * Marca el envío exitoso de un formulario. Es el evento sobre el que se
 * construyen las conversiones de Google Ads: `generate_lead` en GA4 y `Lead`
 * en Meta. Silencioso si los scripts no cargaron (bloqueador, consentimiento).
 */
export function trackLead(source: string): void {
  if (typeof window === 'undefined') return;

  window.dataLayer?.push({ event: 'generate_lead', form_source: source });
  window.gtag?.('event', 'generate_lead', { form_source: source });
  window.fbq?.('track', 'Lead', { content_name: source });
}
