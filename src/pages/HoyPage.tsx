import { useState } from 'react';
import { IconCheck } from '../components/Icons';
import { LEAVE_AT, LISTS, type ListId } from '../data/lists';
import { useChecklist } from '../hooks/useChecklist';
import { useNow } from '../hooks/useNow';
import { currentIndex, defaultList, headline } from '../lib/checklist';

const TABS: { id: ListId; label: string }[] = [
  { id: 'noche', label: 'Noche' },
  { id: 'manana', label: 'Mañana' },
];

export function HoyPage(): JSX.Element {
  const now = useNow();
  const [list, setList] = useState<ListId>(() => defaultList(new Date()));
  const items = LISTS[list];
  const { done, toggle, clear } = useChecklist(list, now);

  const total = items.length;
  const complete = done.length === total;
  const current = list === 'manana' ? currentIndex(items, now) : -1;

  return (
    <div className="today">
      <div className="tabs" role="tablist" aria-label="Lista">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={list === t.id}
            aria-controls="lista"
            onClick={() => setList(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <header className="status">
        <span className="label">{list === 'noche' ? 'Preparar para mañana' : `Salida a las ${LEAVE_AT}`}</span>
        <p className="count" data-done={complete} aria-live="polite">
          {headline(list, done.length, total, now, LEAVE_AT)}
        </p>
        <div className="bar" aria-hidden="true">
          <span style={{ width: `${(done.length / total) * 100}%` }} />
        </div>
      </header>

      <ul className="items" id="lista" role="tabpanel" aria-labelledby={`tab-${list}`}>
        {items.map((it, i) => {
          const on = done.includes(it.id);
          return (
            <li key={it.id}>
              <button
                type="button"
                className="item"
                data-checked={on}
                data-now={i === current && !on}
                data-timed={Boolean(it.at)}
                aria-pressed={on}
                onClick={() => toggle(it.id)}
              >
                {it.at && <span className="time">{it.at}</span>}
                <span className="text">
                  <span className="main">{it.text}</span>
                  {it.sub && <small>{it.sub}</small>}
                </span>
                <span className="box">
                  <IconCheck />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {done.length > 0 && (
        <button type="button" className="reset" onClick={clear}>
          Desmarcar todo
        </button>
      )}
    </div>
  );
}
