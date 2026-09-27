# InkyzProd — Developer Portfolio

A minimalist dark, obsidian-themed single-page developer portfolio and systems engineering showcase. Built with high restraint, typography focus, a signature floating island navbar, and a spring-physics orbital radial FAB contact menu.

## Tech Stack Choice

**Vite + React 19 + TypeScript + Motion + Tailwind CSS v4**  
*Reason:* The lightest viable SPA stack yielding zero-runtime backend dependencies, instant sub-second static builds to `/dist`, seamless zero-config Vercel deployment, and fluid spring physics for orbital micro-interactions.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (or `pnpm` / `bun`)

---

## Local Development Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8690` in your browser (the port is fixed by the `--port=8690` flag in the `dev` script).

3. **Type-check and lint**:
   ```bash
   npm run lint
   ```

---

## Build Command

To compile an optimized production static bundle into the `dist/` directory:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Vercel Deployment Steps

### Deploy via Vercel CLI (Fastest)

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run deploy in the project root:
   ```bash
   vercel
   ```
3. For production release:
   ```bash
   vercel --prod
   ```