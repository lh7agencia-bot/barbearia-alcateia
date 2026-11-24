import { FormEvent, useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, SERVICES, TIME_SLOTS } from '../data/barbershop';
import {
  BookingInput,
  buildBookingWhatsAppUrl,
  formatDateBr,
  getTodayIsoDate,
  getTomorrowIsoDate,
  validateBooking,
} from '../utils/booking';

interface BookingSectionProps {
  selectedService: string;
  onServiceChange: (service: string) => void;
}

export function BookingSection({ selectedService, onServiceChange }: BookingSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => getTomorrowIsoDate());
  const [time, setTime] = useState('15:00');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingInput | null>(null);

  useEffect(() => {
    if (selectedService) {
      setConfirmedBooking(null);
    }
  }, [selectedService]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: BookingInput = {
      name,
      phone,
      service: selectedService,
      date,
      time,
    };
    const result = validateBooking(payload);
    if (!result.valid) {
      setErrors(result.errors);
      setConfirmedBooking(null);
      return;
    }

    setErrors({});
    setConfirmedBooking(payload);
  };

  return (
    <section
      id="agendamento"
      className="py-16 lg:py-24 bg-[#1E1E1E] border-b border-white/10"
      aria-labelledby="heading-agendamento"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left column: Booking context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wider text-[#A3A3A3]">
                Reserve sem fila
              </p>
              <h2
                id="heading-agendamento"
                className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F2F2F0] [text-wrap:balance]"
              >
                Agendamento Online
              </h2>
              <p className="text-sm sm:text-base text-[#C4C4C4] leading-relaxed">
                Escolha o serviço, o dia e o horário de sua preferência. Após enviar, confirmamos
                diretamente pelo WhatsApp da Barbearia Alcateia.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#1A1A1A] border border-white/10 space-y-4">
              <h3 className="font-display text-xl font-bold text-[#F2F2F0]">
                Horário de Funcionamento
              </h3>
              <dl className="space-y-2.5 text-sm">
                {BUSINESS_INFO.hours.map((item) => (
                  <div
                    key={item.days}
                    className="flex items-center justify-between gap-4 py-1.5 border-b border-white/5 last:border-b-0"
                  >
                    <dt className="text-[#B8B8B8]">{item.days}</dt>
                    <dd className="font-medium text-[#F2F2F0] tabular-nums">{item.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right column: Interactive Booking Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-8 rounded-lg bg-[#1A1A1A] border border-white/10 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="booking-service"
                    className="block text-xs font-medium text-[#D4D4D4] mb-2"
                  >
                    Serviço desejado
                  </label>
                  <select
                    id="booking-service"
                    value={selectedService}
                    onChange={(e) => {
                      onServiceChange(e.target.value);
                      setErrors((prev) => ({ ...prev, service: '' }));
                    }}
                    className="w-full h-11 px-3.5 rounded bg-[#242424] border border-white/15 text-sm text-[#F2F2F0] focus:outline-none focus:border-[#9CA3AF]"
                  >
                    {SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.name}>
                        {srv.name} ({srv.duration})
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">
                      {errors.service}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-medium text-[#D4D4D4] mb-2"
                  >
                    Data do atendimento
                  </label>
                  <div className="relative">
                    <input
                      id="booking-date"
                      type="date"
                      min={getTodayIsoDate()}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setErrors((prev) => ({ ...prev, date: '' }));
                        setConfirmedBooking(null);
                      }}
                      className="w-full h-11 px-3.5 rounded bg-[#242424] border border-white/15 text-sm text-[#F2F2F0] tabular-nums focus:outline-none focus:border-[#9CA3AF]"
                    />
                  </div>
                  {errors.date && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">
                      {errors.date}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-[#D4D4D4] mb-2.5">
                  Horário disponível
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5" role="group" aria-label="Horários disponíveis">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setTime(slot);
                          setErrors((prev) => ({ ...prev, time: '' }));
                          setConfirmedBooking(null);
                        }}
                        aria-pressed={isSelected}
                        className={`h-11 rounded text-sm font-medium tabular-nums transition-colors ${
                          isSelected
                            ? 'bg-[#4A4A4A] text-white border border-white/30'
                            : 'bg-[#242424] text-[#D4D4D4] border border-white/10 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {errors.time && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.time}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-medium text-[#D4D4D4] mb-2"
                  >
                    Seu nome
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    placeholder="Ex.: Lucas Ferreira"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                      setConfirmedBooking(null);
                    }}
                    className="w-full h-11 px-3.5 rounded bg-[#242424] border border-white/15 text-sm text-[#F2F2F0] placeholder:text-[#737373] focus:outline-none focus:border-[#9CA3AF]"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs font-medium text-[#D4D4D4] mb-2"
                  >
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    placeholder="(62) 99999-0000"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, phone: '' }));
                      setConfirmedBooking(null);
                    }}
                    className="w-full h-11 px-3.5 rounded bg-[#242424] border border-white/15 text-sm text-[#F2F2F0] placeholder:text-[#737373] tabular-nums focus:outline-none focus:border-[#9CA3AF]"
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#4A4A4A] hover:bg-[#5E5E5E] rounded transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Confirmar Pré-Agendamento
                </button>
              </div>

              {confirmedBooking && (
                <div
                  role="status"
                  className="p-5 rounded-md bg-[#232323] border border-[#4A4A4A] space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">
                        Pré-agendamento preparado para {confirmedBooking.name}
                      </p>
                      <p className="text-xs text-[#D4D4D4] flex flex-wrap items-center gap-2 tabular-nums">
                        <span>{confirmedBooking.service}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDateBr(confirmedBooking.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {confirmedBooking.time}
                        </span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={buildBookingWhatsAppUrl(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#388E3C] rounded transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar Confirmação no WhatsApp ({BUSINESS_INFO.phoneDisplay})
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
