import { useEffect, useState } from 'react';

/** Hora actual, refrescada cada 20 s y al volver a la app. */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = (): void => setNow(new Date());
    const id = window.setInterval(tick, 20_000);
    const onVisible = (): void => {
      if (!document.hidden) tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
  return now;
}
