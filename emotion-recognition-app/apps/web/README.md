# Web App

Next.js App Router frontend for Vietnamese and English social media emotion recognition.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

The frontend calls the Node.js API only. It does not call the FastAPI model service directly. Single-text and CSV batch analysis send `language` as `vi` or `en`.
