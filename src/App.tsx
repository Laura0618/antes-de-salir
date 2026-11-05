import { Link, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CuentaPage } from './pages/CuentaPage';
import { HoyPage } from './pages/HoyPage';

function NoEncontrado(): JSX.Element {
  return (
    <div className="page">
      <h1 className="page-title">No encontrado</h1>
      <p className="muted">
        Esta pantalla no existe. <Link to="/">Volver a la lista</Link>
      </p>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HoyPage />} />
        <Route path="cuenta" element={<CuentaPage />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
