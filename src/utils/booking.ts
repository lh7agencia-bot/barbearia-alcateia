import { BUSINESS_INFO } from '../data/barbershop';

export interface BookingInput {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function getTomorrowIsoDate(referenceDate: Date = new Date()): string {
  const next = new Date(referenceDate);
  next.setDate(next.getDate() + 1);
  // Skip Sunday (0) and Monday (1) when defaulting
  while (next.getDay() === 0 || next.getDay() === 1) {
    next.setDate(next.getDate() + 1);
  }
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getTodayIsoDate(referenceDate: Date = new Date()): string {
  const yyyy = referenceDate.getFullYear();
  const mm = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const dd = String(referenceDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateBr(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function sanitizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function validateBooking(
  input: BookingInput,
  todayIso: string = getTodayIsoDate(),
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name = 'Informe seu nome completo.';
  }

  const digits = sanitizePhoneDigits(input.phone);
  if (digits.length < 10 || digits.length > 13) {
    errors.phone = 'Informe um WhatsApp válido com DDD.';
  }

  if (!input.service.trim()) {
    errors.service = 'Selecione um serviço.';
  }

  if (!input.date) {
    errors.date = 'Escolha uma data para o atendimento.';
  } else if (input.date < todayIso) {
    errors.date = 'Escolha uma data a partir de hoje.';
  }

  if (!input.time) {
    errors.time = 'Selecione um horário disponível.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateContact(input: ContactInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name = 'Informe seu nome.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email.trim() || !emailRegex.test(input.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!input.message.trim() || input.message.trim().length < 8) {
    errors.message = 'Escreva sua mensagem (mínimo de 8 caracteres).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildBookingWhatsAppUrl(input: BookingInput): string {
  const formattedDate = formatDateBr(input.date);
  const message =
    `Olá, Barbearia Alcateia! Gostaria de confirmar um agendamento:\n` +
    `• Nome: ${input.name.trim()}\n` +
    `• Telefone: ${input.phone.trim()}\n` +
    `• Serviço: ${input.service}\n` +
    `• Data: ${formattedDate}\n` +
    `• Horário: ${input.time}`;

  return `https://wa.me/${BUSINESS_INFO.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function buildContactWhatsAppUrl(input: ContactInput): string {
  const message =
    `Olá, Barbearia Alcateia! Mensagem enviada pelo site:\n` +
    `• Nome: ${input.name.trim()}\n` +
    `• E-mail: ${input.email.trim()}\n` +
    `• Mensagem: ${input.message.trim()}`;

  return `https://wa.me/${BUSINESS_INFO.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function buildContactMailtoUrl(input: ContactInput): string {
  const subject = `Contato pelo site — ${input.name.trim()}`;
  const body =
    `Nome: ${input.name.trim()}\n` +
    `E-mail: ${input.email.trim()}\n\n` +
    `Mensagem:\n${input.message.trim()}`;

  return `mailto:${BUSINESS_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildDirectionsUrl(origin?: string): string {
  const destination = encodeURIComponent(BUSINESS_INFO.address);
  if (origin && origin.trim().length > 0) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.trim())}&destination=${destination}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

export function buildWazeDirectionsUrl(): string {
  return `https://waze.com/ul?q=${encodeURIComponent(BUSINESS_INFO.address)}&navigate=yes`;
}
