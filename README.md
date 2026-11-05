# Antes de salir

PWA mínima para salir de casa a entrenar por la mañana sin pensar: una lista para
preparar todo **la noche anterior** y otra para **la mañana**, con cuenta atrás hasta
la hora de salida.

- **Noche**: ropa, mochila, desayuno, bici, cargadores, alarma y mochila junto a la
  puerta. Lo marcado se conserva por la mañana y se reinicia a las 15:00.
- **Mañana**: de 06:05 a 06:30, con la tarea que toca resaltada y «Quedan X min».
  Se reinicia a medianoche.
- La app abre en Noche a partir de las 15:00 (y de madrugada) y en Mañana el resto del día.
- Instalable en el iPhone y funciona sin conexión.
- Con sesión de Google, lo marcado se **sincroniza** entre dispositivos (Cloudflare D1).
  Sin sesión, se guarda en el dispositivo.

Misma arquitectura que Pedalea y Protocolos: React + Vite + TypeScript y un Worker de
Cloudflare que sirve la PWA y la API (`/api/*`).

Las listas viven en `src/data/lists.ts`. Cada tarea tiene un `id` estable, así que se
puede cambiar el texto o el orden sin perder lo marcado.

## Desarrollo

```bash
npm ci
npm run dev        # PWA en :5173
npm run dev:api    # API con wrangler en :8787 (necesita .dev.vars, ver .dev.vars.example)
npm run lint && npm test && npm run build
```

## Datos

Cada dato es un documento clave → JSON con `updatedAt`; gana el más reciente por clave.

- `check:noche:YYYY-MM-DD`: ids marcados la noche que empieza ese día.
- `check:manana:YYYY-MM-DD`: ids marcados esa mañana.

## Despliegue en Cloudflare

1. **D1:** Workers & Pages → D1 → Create Database → `antes_de_salir`. Copia el `database_id` en `wrangler.toml`.
2. **Worker:** Workers & Pages → Create → Workers → Import a repository → `Laura0618/antes-de-salir`. Build command `npm run build`, deploy command `npx wrangler deploy`. Cada `git push` a `main` redespliega. La versión de Node se toma de `.node-version` (22).
3. **Google:** en el cliente OAuth de Pedalea, añade el origen `https://antes-de-salir.castrolaura0311.workers.dev` y la URI de redirección `https://antes-de-salir.castrolaura0311.workers.dev/api/auth/callback`.
4. **Secreto:** Cloudflare → antes-de-salir → Settings → Variables and Secrets → Add → Secret `GOOGLE_CLIENT_SECRET`.

Sin el paso 4 la app funciona igual, solo en modo local.
