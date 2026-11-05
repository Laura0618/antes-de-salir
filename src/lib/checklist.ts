import type { Item, ListId } from '../data/lists';

/** A partir de esta hora, la lista de noche es la de la noche siguiente. */
export const NIGHT_FROM_MIN = 15 * 60;
/** Hasta esta hora de la madrugada la app sigue abriendo en Noche. */
const NIGHT_UNTIL_MIN = 4 * 60;
/** La cuenta atrás de la mañana se muestra desde esta hora. */
const COUNTDOWN_FROM_MIN = 5 * 60;

export const CHECK_PREFIX = 'check:';

export function toMin(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function minutesOfDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Dia al que pertenece lo marcado ahora.
 * - Mañana: el dia de hoy (se reinicia a medianoche).
 * - Noche: la noche empieza a las 15:00, así que lo marcado anoche sigue
 *   marcado por la mañana y se reinicia a las 15:00.
 */
export function periodDate(list: ListId, now: Date): string {
  const d = new Date(now);
  if (list === 'noche' && minutesOfDay(now) < NIGHT_FROM_MIN) d.setDate(d.getDate() - 1);
  return dateKey(d);
}

export function checkKey(list: ListId, now: Date): string {
  return `${CHECK_PREFIX}${list}:${periodDate(list, now)}`;
}

/** Lista que se abre por defecto según la hora. */
export function defaultList(now: Date): ListId {
  const m = minutesOfDay(now);
  return m >= NIGHT_FROM_MIN || m < NIGHT_UNTIL_MIN ? 'noche' : 'manana';
}

/** Índice de la tarea que toca según la hora (-1 si aún no toca ninguna). */
export function currentIndex(items: readonly Item[], now: Date): number {
  const m = minutesOfDay(now);
  let current = -1;
  items.forEach((it, i) => {
    if (it.at && m >= toMin(it.at)) current = i;
  });
  return current;
}

/** Ids marcados guardados, limpios de valores raros o de tareas que ya no existen. */
export function normalizeDone(raw: unknown, items: readonly Item[]): string[] {
  if (!Array.isArray(raw)) return [];
  const known = new Set(items.map((i) => i.id));
  return [...new Set(raw.filter((x): x is string => typeof x === 'string' && known.has(x)))];
}

export function headline(list: ListId, done: number, total: number, now: Date, leaveAt: string): string {
  if (list === 'noche') return done === total ? 'Todo listo' : `${done} de ${total} listo`;
  if (done === total) return 'Todo hecho';
  const m = minutesOfDay(now);
  const left = toMin(leaveAt) - m;
  if (m >= COUNTDOWN_FROM_MIN && left > 0) return `Quedan ${left} min`;
  if (left <= 0 && left > -60) return 'Hora de salir';
  return `${done} de ${total}`;
}
