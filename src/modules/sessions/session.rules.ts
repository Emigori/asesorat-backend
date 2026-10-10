/**
 * Reglas de negocio puras (sin acceso a BD) para reservaciones.
 * Se mantienen aisladas para poder cubrirlas con pruebas unitarias en la siguiente entrega.
 */
import { Role } from '../users/user.model';
import { SessionStatus } from './session.model';

export const TIMEZONE = 'America/Mexico_City';

export interface AvailabilitySlot {
  dayOfWeek: number;
  from: string; // HH:mm
  to: string; // HH:mm
}

/** Devuelve día de la semana y hora HH:mm de una fecha en la zona horaria del campus. */
export function toLocalParts(date: Date, timeZone = TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return { dayOfWeek: days.indexOf(get('weekday')), time: `${get('hour')}:${get('minute')}` };
}

/** La sesión completa [start, end) debe caber dentro de algún bloque de disponibilidad del asesor (mismo día). */
export function fitsAvailability(start: Date, end: Date, slots: AvailabilitySlot[], timeZone = TIMEZONE) {
  const s = toLocalParts(start, timeZone);
  const e = toLocalParts(end, timeZone);
  if (s.dayOfWeek !== e.dayOfWeek && e.time !== '00:00') return false;
  return slots.some((slot) => slot.dayOfWeek === s.dayOfWeek && slot.from <= s.time && e.time <= slot.to);
}

/** Dos intervalos semiabiertos se traslapan si cada uno empieza antes de que el otro termine. */
export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

/** Transiciones de estado permitidas según el rol de quien actúa. */
const TRANSITIONS: Record<SessionStatus, Partial<Record<SessionStatus, Role[]>>> = {
  pending: { confirmed: ['tutor'], cancelled: ['student', 'tutor'] },
  confirmed: { cancelled: ['student', 'tutor'], completed: ['tutor'] },
  cancelled: {},
  completed: {},
};

export function canTransition(from: SessionStatus, to: SessionStatus, actor: Role) {
  return TRANSITIONS[from][to]?.includes(actor) ?? false;
}
