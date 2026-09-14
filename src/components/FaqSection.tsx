import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { sound } from '../audio/sound';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do my friends need to install an app or create an account?',
      a: 'No. When you share a decision link or group chat summary, it opens directly in any browser (Safari, Chrome, WhatsApp preview, Telegram) with zero signups or downloads required.'
    },
    {
      q: 'How are decisions calculated?',
      a: 'Every option has an equal chance of winning. Solo spins pick on your device; squad rooms and the fair flip API pick on our servers. All of it is random — nothing favors an option.'
    },
    {
      q: 'Where are my past decisions saved?',
      a: 'Solo history lives privately in your browser\'s local storage. Squad rooms sync through our hosted database while they are active, so anyone with the room link can read that room.'
    },
    {
      q: 'Can I add my own custom choices?',
      a: 'Yes. You can type any custom options, remove candidates with one click, or shuffle the ordering anytime before spinning.'
    }
  ];

  const handleToggle = (i: number) => {
    sound.tap();
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-8 max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900 mb-2">
          Frequently asked questions
        </h2>
        <p className="text-sm text-ink-600">
          Everything you need to know about how No Debates works.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => handleToggle(i)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-ink-900"
              >
                <span>{faq.q}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-ink-400 transition-transform duration-200 ${
                    isOpen ? 'transform rotate-180 text-ink-900' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-ink-600 leading-relaxed border-t border-ink-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
