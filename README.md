# FLUXI V5

FLUXI V5 is a stylized Ultraviolet-based web proxy with a browser-like interface, in-app tabs, quick links, and Wisp/Epoxy transport support.

## Features

- Multi-tab browsing inside Fluxi
- New-tab requests from proxied pages open in Fluxi tabs
- Quick access launchers for popular sites
- Ultraviolet service worker proxying
- BareMux + Epoxy transport with Wisp WebSocket tunneling

## Requirements

- Node.js 18+
- npm

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:8080
```

If port `8080` is already in use:

```powershell
$env:PORT=8081
npm start
```

## Project structure

- `server.js` - Express server, static assets, Wisp upgrade handling
- `public/index.html` - main UI shell
- `public/app.js` - client logic, tab management, navigation flow
- `public/style.css` - Fluxi visual design
- `public/uv/uv.config.js` - Ultraviolet config overrides

## Notes

- Open the app with `http://localhost:<port>` rather than your machine hostname.
- This project depends on WebSockets and a persistent Node server.
- Vercel is not a good deployment target for this app.
- Railway, Render, or a VPS are better fits.

## Git

This repo should ignore dependencies and local noise files before committing.

```bash
git init
git add .
git commit -m "Initial commit"
```
