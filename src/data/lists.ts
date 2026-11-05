/**
 * Las dos listas de la app. Los `id` son estables: lo marcado se guarda por id,
 * asi que se puede cambiar el texto o el orden sin perder nada.
 */

export type ListId = 'noche' | 'manana';

export interface Item {
  id: string;
  text: string;
  sub?: string;
  /** Hora prevista (HH:MM). Solo en la lista de la mañana. */
  at?: string;
}

/** Hora de salida de casa. */
export const LEAVE_AT = '06:30';

export const LISTS: Record<ListId, Item[]> = {
  noche: [
    {
      id: 'ropa',
      text: 'Ropa deportiva preparada',
      sub: 'Ropa interior, calcetines, leggings, camiseta, sujetador, zapatillas y sudadera',
    },
    { id: 'mochila', text: 'Mochila hecha', sub: 'Botella de agua, toalla, candado de taquilla y auriculares' },
    { id: 'desayuno', text: 'Desayuno preparado', sub: 'Y el plato o recipiente listo' },
    { id: 'bici', text: 'Bici revisada', sub: 'Ruedas, frenos y luces' },
    { id: 'cargar', text: 'Cargando móvil, auriculares y reloj' },
    { id: 'alarma', text: 'Alarma a las 06:05' },
    { id: 'puerta', text: 'Mochila y casco junto a la puerta' },
  ],
  manana: [
    { id: 'vestir', at: '06:05', text: 'Levantarme y vestirme', sub: 'Ropa deportiva' },
    { id: 'cara', at: '06:10', text: 'Cara y desodorante' },
    { id: 'desayunar', at: '06:15', text: 'Desayunar' },
    { id: 'dientes', at: '06:25', text: 'Lavarme los dientes' },
    { id: 'coger', at: '06:28', text: 'Coger lo de salir', sub: 'Móvil, llaves, mochila y casco' },
    { id: 'salir', at: '06:30', text: 'Salir en bici' },
  ],
};
