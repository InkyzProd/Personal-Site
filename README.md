# InkyzProd — Developer Portfolio

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/InkyzProd/Personal-Site)

A minimalist dark, obsidian-themed single-page developer portfolio and systems engineering showcase. Built with high restraint, typography focus, a signature floating island navbar, and a spring-physics orbital radial FAB contact menu.

## Tech Stack Choice

**Vite + React 19 + TypeScript + Motion + Tailwind CSS v4**  
*Reason:* The lightest viable SPA stack yielding zero-runtime backend dependencies, instant sub-second static builds to `/dist`, seamless zero-config deployment to Vercel or Cloudflare Workers, and fluid spring physics for orbital micro-interactions.

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

## Deployment

### Cloudflare Workers (Recommended for Production)

This project is highly optimized for deployment as a Cloudflare Worker using the native Git integration. This method provides automated CI/CD, meaning every push to your production branch will automatically trigger a new build and deployment to Cloudflare's global edge network.

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** and click **Create Application**.
3. Select **Connect to Git** and authorize your GitHub account.
4. Choose the `Personal-Site` repository.
5. Configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**.

*Alternatively, you can deploy manually via the Wrangler CLI:*

```bash
npm i -g wrangler
wrangler deploy
```

### Vercel (Alternative)

If you prefer Vercel, you can deploy using the Vercel CLI:

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
