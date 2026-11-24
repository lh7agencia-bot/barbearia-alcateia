import { BUSINESS_INFO } from '../data/barbershop';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#141414] border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="font-display text-2xl font-bold text-[#F2F2F0]">{BUSINESS_INFO.name}</p>
          <p className="text-xs text-[#A3A3A3]">
            {BUSINESS_INFO.slogan} · {BUSINESS_INFO.address}
          </p>
        </div>

        <nav aria-label="Links do rodapé" className="flex flex-wrap items-center gap-6 text-xs text-[#B8B8B8]">
          <a href="#servicos" className="hover:text-white transition-colors">
            Serviços
          </a>
          <a href="#galeria" className="hover:text-white transition-colors">
            Galeria
          </a>
          <a href="#agendamento" className="hover:text-white transition-colors">
            Agendamento
          </a>
          <a href="#depoimentos" className="hover:text-white transition-colors">
            Depoimentos
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            Dúvidas
          </a>
          <a href="#contato" className="hover:text-white transition-colors">
            Contato
          </a>
        </nav>

        <p className="text-xs text-[#8A8A8A] tabular-nums">
          © {currentYear} {BUSINESS_INFO.name}
        </p>
      </div>
    </footer>
  );
}
