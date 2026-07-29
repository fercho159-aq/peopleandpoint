import type { JsonLd } from '@/lib/seo';

/** Renders schema.org structured data. Server component — no hydration cost. */
export function JsonLdScript({ data }: { data: readonly JsonLd[] }) {
  return (
    <>
      {data.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  );
}
