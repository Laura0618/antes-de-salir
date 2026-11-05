import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSync } from '../store/SyncProvider';
import { IconAccount, IconBack } from './Icons';

function AccountLink(): JSX.Element {
  const { authStatus, syncStatus } = useSync();
  const signedIn = authStatus === 'signed_in';
  const tone = syncStatus === 'error' || syncStatus === 'offline' ? 'warn' : 'ok';
  return (
    <Link to="/cuenta" className="icon-btn" aria-label="Cuenta y sincronización" data-tone={signedIn ? tone : undefined}>
      <IconAccount />
      {signedIn && <span className="dot" aria-hidden="true" />}
    </Link>
  );
}

export function Layout(): JSX.Element {
  const { pathname } = useLocation();
  const home = pathname === '/';
  return (
    <div className="shell">
      <header className="app-header">
        {home ? (
          <span className="brand">Antes de salir</span>
        ) : (
          <Link to="/" className="back">
            <IconBack />
            <span>Volver</span>
          </Link>
        )}
        {home && <AccountLink />}
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
