import { ArrowUpRight } from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/barbershop';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section
      id="servicos"
      className="py-16 lg:py-24 bg-[#1E1E1E] border-b border-white/10"
      aria-labelledby="heading-servicos"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#A3A3A3]">
              Cuidado masculino completo
            </p>
            <h2
              id="heading-servicos"
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F2F2F0] [text-wrap:balance]"
            >
              Nossos Serviços
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#B8B8B8] max-w-md leading-relaxed">
            Cada atendimento inclui avaliação do formato do rosto e finalização alinhada ao seu estilo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          {SERVICES.map((service: ServiceItem) => (
            <article
              key={service.id}
              className="flex flex-col justify-between p-6 rounded-lg bg-[#1A1A1A] border border-white/10 hover:border-[#4A4A4A] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#A3A3A3] tabular-nums">
                  <span>{service.code}. Serviço</span>
                  <span>{service.duration}</span>
                </div>

                <h3 className="font-display text-2xl font-bold tracking-tight text-[#F2F2F0]">
                  {service.name}
                </h3>

                <p className="text-sm text-[#C4C4C4] leading-relaxed">{service.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href="#agendamento"
                  onClick={() => onSelectService(service.name)}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-[#F2F2F0] bg-[#262626] hover:bg-[#4A4A4A] rounded transition-colors whitespace-nowrap"
                >
                  <span>Agendar {service.name}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
