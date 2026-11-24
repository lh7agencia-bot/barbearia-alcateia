import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/barbershop';

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="py-16 lg:py-24 bg-[#1A1A1A] border-b border-white/10"
      aria-labelledby="heading-depoimentos"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#A3A3A3]">
              Avaliação de clientes
            </p>
            <h2
              id="heading-depoimentos"
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F2F2F0] [text-wrap:balance]"
            >
              Depoimentos
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#B8B8B8] max-w-md leading-relaxed">
            Quem frequenta a Barbearia Alcateia destaca a pontualidade, o cuidado técnico e o
            ambiente reservado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="p-6 sm:p-7 rounded-lg bg-[#212121] border border-white/10 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div
                  className="flex items-center gap-1"
                  aria-label={`${item.rating} de 5 estrelas`}
                >
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="text-sm sm:text-base text-[#E5E5E5] leading-relaxed">
                  “{item.text}”
                </blockquote>
              </div>

              <footer className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 text-xs">
                <span className="font-semibold text-[#F2F2F0]">{item.name}</span>
                <span className="text-[#A3A3A3]">{item.service}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
