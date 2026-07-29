'use client';

import { useState } from 'react';

import type { Faq } from '@/lib/site';

export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-navy/10 border-y border-navy/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold text-navy transition hover:text-gold"
              >
                {item.question}
                <span
                  aria-hidden
                  className={`shrink-0 text-2xl leading-none text-gold transition-transform ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="pb-6 text-[17px] leading-relaxed text-ink">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
