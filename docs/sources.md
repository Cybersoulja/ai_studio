# Imported Sources

How the supplied repositories map into this AI Studio project (USS Hustle).

| Source repo | Stack | What we take from it | Where it lands |
|:---|:---|:---|:---|
| `Cybersoulja/trill-local-runtime` | Python, local automation | n8n API catalog and local-runtime automation context | `skills/n8n/catalog.json`, `automations/` |
| `Cybersoulja/charhubai-stagetemp` | TypeScript / SCSS / JS | Stage/character UI composition patterns | `src/` (HUD, crew roster, transmission log), `themes/` |
| `Cybersoulja/canva-apps-sdk-starter-kit` | TypeScript / JS | App starter layout and env-driven configuration | `package.json`, `vite.config.ts`, `.env.example` |

## Configuration

No secrets are committed. Copy `.env.example` to `.env` and fill in values.
The n8n catalog reads `N8N_BASE_URL` (default `http://localhost:5678`) and `N8N_API_KEY`.

## n8n catalog

`skills/n8n/catalog.json` is the canonical, machine-readable list of n8n REST endpoints
(`method`, `path`, `filters`, `path_params`, `response`) used by agent skills.
