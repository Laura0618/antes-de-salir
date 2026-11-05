import { useCallback, useMemo } from 'react';
import { LISTS, type ListId } from '../data/lists';
import { checkKey, normalizeDone } from '../lib/checklist';
import { docStore, useDoc } from '../lib/docs';

export interface ChecklistApi {
  done: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

/** Casillas marcadas de una lista en el periodo actual (noche o mañana). */
export function useChecklist(list: ListId, now: Date): ChecklistApi {
  const key = checkKey(list, now);
  const items = LISTS[list];
  const raw = useDoc<unknown>(key, null);
  const done = useMemo(() => normalizeDone(raw, items), [raw, items]);

  const toggle = useCallback(
    (id: string) => {
      const current = normalizeDone(docStore.get<unknown>(key, null), items);
      docStore.set(key, current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    },
    [key, items],
  );

  const clear = useCallback(() => docStore.remove(key), [key]);

  return { done, toggle, clear };
}
