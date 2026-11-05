import { LISTS } from '../../data/lists';
import { checkKey, currentIndex, defaultList, headline, normalizeDone } from '../checklist';

const at = (iso: string): Date => new Date(iso);

describe('reinicios', () => {
  it('lo marcado por la noche sigue marcado por la mañana y se reinicia a las 15:00', () => {
    const anoche = checkKey('noche', at('2026-11-05T22:30:00'));
    expect(anoche).toBe('check:noche:2026-11-05');
    expect(checkKey('noche', at('2026-11-06T06:10:00'))).toBe(anoche);
    expect(checkKey('noche', at('2026-11-06T14:59:00'))).toBe(anoche);
    expect(checkKey('noche', at('2026-11-06T15:00:00'))).toBe('check:noche:2026-11-06');
  });

  it('la mañana se reinicia a medianoche', () => {
    expect(checkKey('manana', at('2026-11-05T23:59:00'))).toBe('check:manana:2026-11-05');
    expect(checkKey('manana', at('2026-11-06T00:00:00'))).toBe('check:manana:2026-11-06');
  });
});

describe('lista por defecto', () => {
  it('abre Noche por la tarde y de madrugada, y Mañana el resto', () => {
    expect(defaultList(at('2026-11-05T21:00:00'))).toBe('noche');
    expect(defaultList(at('2026-11-06T01:00:00'))).toBe('noche');
    expect(defaultList(at('2026-11-06T06:07:00'))).toBe('manana');
    expect(defaultList(at('2026-11-06T12:00:00'))).toBe('manana');
  });
});

describe('mañana', () => {
  const items = LISTS.manana;

  it('resalta la tarea que toca por la hora', () => {
    expect(currentIndex(items, at('2026-11-06T05:50:00'))).toBe(-1);
    expect(currentIndex(items, at('2026-11-06T06:05:00'))).toBe(0);
    expect(currentIndex(items, at('2026-11-06T06:27:00'))).toBe(3);
    expect(currentIndex(items, at('2026-11-06T06:29:00'))).toBe(4);
  });

  it('cuenta atrás hasta la salida', () => {
    expect(headline('manana', 0, 6, at('2026-11-06T06:12:00'), '06:30')).toBe('Quedan 18 min');
    expect(headline('manana', 3, 6, at('2026-11-06T06:31:00'), '06:30')).toBe('Hora de salir');
    expect(headline('manana', 6, 6, at('2026-11-06T06:20:00'), '06:30')).toBe('Todo hecho');
    expect(headline('manana', 2, 6, at('2026-11-06T10:00:00'), '06:30')).toBe('2 de 6');
  });
});

describe('noche', () => {
  it('muestra el progreso', () => {
    expect(headline('noche', 3, 7, at('2026-11-05T22:00:00'), '06:30')).toBe('3 de 7 listo');
    expect(headline('noche', 7, 7, at('2026-11-05T22:00:00'), '06:30')).toBe('Todo listo');
  });
});

it('ignora valores guardados que no son tareas', () => {
  expect(normalizeDone(['ropa', 'ropa', 'otra', 3], LISTS.noche)).toEqual(['ropa']);
  expect(normalizeDone('x', LISTS.noche)).toEqual([]);
});
