# ARCHIVE — frontend (Next.js)

Marketplace for unused social media, gaming and marketplace accounts. JavaScript only, MongoDB only (no Mongoose).

## Run in VS Code
1. Install Node.js 20+ from https://nodejs.org and open this folder in VS Code (File > Open Folder).
2. Open the terminal (Ctrl + `) and run: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values (see the file for comments).
4. Start the **server project first** (see its README), then run: `npm run dev`
5. Open http://localhost:3000

## Where things are
- `src/lib/categories.js` — the whole category tree (navbar menu, filters, add-listing form all read from it)
- `src/components/Logo.jsx` — logo. Files: `public/logo.svg`, `public/logo.png`, `src/app/icon.svg` (favicon)
- `src/app/components/Banner.jsx` — animated home banner
- `src/app/api/payment` (card), `src/app/api/crypto/checkout` (listing, crypto), `src/app/api/crypto/plan` (seller plan, crypto)
