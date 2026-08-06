import Script from 'next/script';

import { analytics } from '@/lib/analytics';

/**
 * Etiquetas de medición del sitio corporativo: GA4 y el píxel de Meta, tal
 * como venían del WordPress anterior. Se cargan después de la hidratación para
 * no competir con el contenido por el hilo principal.
 */
export function Analytics() {
  const [primaryGa4] = analytics.ga4Ids;

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryGa4}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${analytics.ga4Ids.map((id) => `gtag('config', '${id}');`).join('\n')}`}
      </Script>

      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${analytics.metaPixelId}');
fbq('track', 'PageView');`}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${analytics.metaPixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
