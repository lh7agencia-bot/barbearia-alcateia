import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO, ESTABLISHMENT_PHOTOS } from '../data/barbershop';
import { BarberPole3DCanvas } from './BarberPole3DCanvas';

export function HeroSection() {
  const heroPhoto = ESTABLISHMENT_PHOTOS[0];

  return (
    <section
      id="topo"
      className="relative bg-[#1A1A1A] border-b border-white/10 pt-10 pb-14 lg:pt-16 lg:pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Headline, Slogan & Real Shop Snapshot */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#A3A3A3] tracking-wide">
                <span>Goiás - GO</span>
                <span aria-hidden="true">·</span>
                <span>Jardim Vila Boa</span>
                <span aria-hidden="true">·</span>
                <span>Atendimento com hora marcada</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-[#F2F2F0] leading-[1.02] [text-wrap:balance]">
                {BUSINESS_INFO.name}: {BUSINESS_INFO.slogan}.
              </h1>

              <p className="text-base sm:text-lg text-[#C4C4C4] leading-relaxed max-w-xl">
                Cortes clássicos e atuais, barba completa com toalha quente e cuidados faciais em um
                ambiente tranquilo na Av. Hermógenes Coelho.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#agendamento"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#4A4A4A] hover:bg-[#5D5D5D] rounded transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Agendar Horário
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#servicos"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-[#E5E5E5] border border-white/20 hover:border-white/40 hover:bg-[#242424] rounded transition-colors whitespace-nowrap"
                >
                  Nossos Serviços
                </a>
              </div>
            </div>

            {/* Real establishment visual preview strip */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-6 border-t border-white/10 items-center">
              <div className="sm:col-span-5 h-32 rounded overflow-hidden border border-white/10 bg-[#232323]">
                <img
                  src={heroPhoto.url}
                  alt={heroPhoto.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 space-y-2 text-sm text-[#D4D4D4]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A3A3A3] shrink-0 mt-0.5" />
                  <span>{BUSINESS_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#A3A3A3] shrink-0" />
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.phoneRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tabular-nums hover:text-white underline-offset-4 hover:underline"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Three.js 3D Scene */}
          <div className="lg:col-span-6 flex items-stretch">
            <BarberPole3DCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
