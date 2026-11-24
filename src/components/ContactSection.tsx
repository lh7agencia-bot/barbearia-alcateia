import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershop';
import {
  buildContactMailtoUrl,
  buildContactWhatsAppUrl,
  ContactInput,
  validateContact,
} from '../utils/booking';
import { LocationMap } from './LocationMap';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedContact, setSubmittedContact] = useState<ContactInput | null>(null);

  const handleValidate = (): ContactInput | null => {
    const payload: ContactInput = { name, email, message };
    const result = validateContact(payload);
    if (!result.valid) {
      setErrors(result.errors);
      setSubmittedContact(null);
      return null;
    }
    setErrors({});
    setSubmittedContact(payload);
    return payload;
  };

  const handleSubmitWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    const validPayload = handleValidate();
    if (!validPayload) return;
  };

  return (
    <section
      id="contato"
      className="py-16 lg:py-24 bg-[#1A1A1A]"
      aria-labelledby="heading-contato"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#A3A3A3]">
              Fale conosco ou venha até a barbearia
            </p>
            <h2
              id="heading-contato"
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F2F2F0] [text-wrap:balance]"
            >
              Contato e Localização
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#B8B8B8] max-w-md leading-relaxed">
            Envie sua mensagem diretamente pelo formulário ou trace sua rota até o Jardim Vila Boa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleSubmitWhatsApp}
              noValidate
              className="p-6 sm:p-7 rounded-lg bg-[#212121] border border-white/10 space-y-5"
            >
              <h3 className="font-display text-2xl font-bold text-[#F2F2F0]">
                Envie uma Mensagem
              </h3>

              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-medium text-[#D4D4D4] mb-2"
                >
                  Nome
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: '' }));
                    setSubmittedContact(null);
                  }}
                  className="w-full h-11 px-3.5 rounded bg-[#181818] border border-white/15 text-sm text-[#F2F2F0] placeholder:text-[#737373] focus:outline-none focus:border-[#9CA3AF]"
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-medium text-[#D4D4D4] mb-2"
                >
                  E-mail
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                    setSubmittedContact(null);
                  }}
                  className="w-full h-11 px-3.5 rounded bg-[#181818] border border-white/15 text-sm text-[#F2F2F0] placeholder:text-[#737373] focus:outline-none focus:border-[#9CA3AF]"
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-[#D4D4D4] mb-2"
                >
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Como podemos ajudar?"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setErrors((prev) => ({ ...prev, message: '' }));
                    setSubmittedContact(null);
                  }}
                  className="w-full p-3.5 rounded bg-[#181818] border border-white/15 text-sm text-[#F2F2F0] placeholder:text-[#737373] focus:outline-none focus:border-[#9CA3AF]"
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4A4A4A] hover:bg-[#5E5E5E] rounded transition-colors cursor-pointer"
              >
                Preparar Envio da Mensagem
              </button>

              {submittedContact && (
                <div
                  role="status"
                  className="p-4 rounded bg-[#1A1A1A] border border-[#4A4A4A] space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-[#E5E5E5]">
                      Mensagem validada. Escolha por onde deseja enviar agora:
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={buildContactWhatsAppUrl(submittedContact)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#388E3C] rounded transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Enviar via WhatsApp
                    </a>
                    <a
                      href={buildContactMailtoUrl(submittedContact)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#F2F2F0] bg-[#303030] hover:bg-[#404040] rounded transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Enviar por E-mail
                    </a>
                  </div>
                </div>
              )}
            </form>

            {/* Direct Info Box */}
            <div className="p-6 rounded-lg bg-[#212121] border border-white/10 space-y-3 text-sm text-[#D4D4D4]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#A3A3A3] shrink-0 mt-1" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
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

          {/* Interactive Map */}
          <div className="lg:col-span-7">
            <LocationMap />
          </div>
        </div>
      </div>
    </section>
  );
}
