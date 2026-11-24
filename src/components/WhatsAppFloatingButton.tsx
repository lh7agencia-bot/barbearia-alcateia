import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershop';

export function WhatsAppFloatingButton() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phoneRaw}?text=${encodeURIComponent(
    'Olá, Barbearia Alcateia! Gostaria de mais informações sobre horários.',
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Conversar no WhatsApp com a ${BUSINESS_INFO.name} (${BUSINESS_INFO.phoneDisplay})`}
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2.5 h-12 px-4 rounded-full bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs sm:text-sm font-semibold shadow-lg border border-white/15 transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp</span>
    </a>
  );
}
