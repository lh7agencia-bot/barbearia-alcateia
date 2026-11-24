import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateBr,
  validateBooking,
  validateContact,
  buildBookingWhatsAppUrl,
  buildContactWhatsAppUrl,
  buildDirectionsUrl,
  getTomorrowIsoDate,
} from './booking';

test('formatDateBr formats YYYY-MM-DD to DD/MM/YYYY', () => {
  assert.equal(formatDateBr('2026-11-26'), '26/11/2026');
  assert.equal(formatDateBr('invalid'), 'invalid');
});

test('validateBooking rejects empty fields and past dates', () => {
  const res = validateBooking(
    { name: '', phone: '123', service: '', date: '2026-01-01', time: '' },
    '2026-11-24',
  );
  assert.equal(res.valid, false);
  assert.ok(res.errors.name);
  assert.ok(res.errors.phone);
  assert.ok(res.errors.service);
  assert.ok(res.errors.date);
  assert.ok(res.errors.time);
});

test('validateBooking accepts valid booking payload', () => {
  const res = validateBooking(
    {
      name: 'Lucas Ferreira',
      phone: '(62) 99657-3854',
      service: 'Barba Completa',
      date: '2026-11-28',
      time: '16:00',
    },
    '2026-11-24',
  );
  assert.equal(res.valid, true);
  assert.deepEqual(res.errors, {});
});

test('validateContact validates email format and message length', () => {
  const bad = validateContact({ name: 'A', email: 'not-an-email', message: 'Oi' });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.email);
  assert.ok(bad.errors.message);

  const good = validateContact({
    name: 'Carlos Silva',
    email: 'carlos@exemplo.com.br',
    message: 'Gostaria de saber sobre horários disponíveis no sábado.',
  });
  assert.equal(good.valid, true);
});

test('buildBookingWhatsAppUrl encodes exact phone and service details', () => {
  const url = buildBookingWhatsAppUrl({
    name: 'Lucas Ferreira',
    phone: '(62) 99999-1234',
    service: 'Barba Completa',
    date: '2026-11-28',
    time: '16:00',
  });
  assert.ok(url.startsWith('https://wa.me/5562996573854?text='));
  assert.ok(decodeURIComponent(url).includes('Barba Completa'));
  assert.ok(decodeURIComponent(url).includes('28/11/2026'));
  assert.ok(decodeURIComponent(url).includes('16:00'));
});

test('buildContactWhatsAppUrl encodes contact details', () => {
  const url = buildContactWhatsAppUrl({
    name: 'Marcos',
    email: 'marcos@teste.com',
    message: 'Horário de funcionamento?',
  });
  assert.ok(url.startsWith('https://wa.me/5562996573854?text='));
  assert.ok(decodeURIComponent(url).includes('marcos@teste.com'));
});

test('buildDirectionsUrl includes origin when provided and destination address', () => {
  const noOrigin = buildDirectionsUrl();
  assert.ok(noOrigin.includes('destination='));
  assert.ok(decodeURIComponent(noOrigin).includes('Av. Hermógenes Coelho'));

  const withOrigin = buildDirectionsUrl('Praça do Coreto, Goiás - GO');
  assert.ok(withOrigin.includes('origin='));
  assert.ok(decodeURIComponent(withOrigin).includes('Praça do Coreto'));
});

test('getTomorrowIsoDate skips Sunday and Monday', () => {
  // 2026-11-21 is Saturday -> +1 is Sunday (skip) -> Monday (skip) -> Tuesday 2026-11-24
  const sat = new Date(2026, 10, 21, 12, 0, 0);
  assert.equal(getTomorrowIsoDate(sat), '2026-11-24');
});
