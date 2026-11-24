import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/barbershop';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 bg-[#1E1E1E] border-b border-white/10"
      aria-labelledby="heading-faq"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 pb-10 border-b border-white/10">
          <p className="text-xs font-medium tracking-wider text-[#A3A3A3]">
            Tire suas dúvidas
          </p>
          <h2
            id="heading-faq"
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F2F2F0] [text-wrap:balance]"
          >
            Perguntas Frequentes
          </h2>
        </div>

        <div className="divide-y divide-white/10 pt-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${item.id}-panel`;
            return (
              <div key={item.id} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between gap-4 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span className="text-base sm:text-lg font-medium text-[#F2F2F0]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#A3A3A3] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    className="pt-2 pb-3 pr-8 text-sm sm:text-base text-[#C4C4C4] leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
