# ketoy-docs-website — Documentation Website

## Purpose

The public documentation site for the Ketoy SDK, deployed on Vercel.

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19.2.0 |
| React Router | 7.13.0 |
| Vite | (latest) |
| Framer Motion | (animations) |
| Prism React Renderer | (code syntax highlighting) |
| React Icons | (icon set) |
| Deployment | Vercel |

## Structure

```
ketoy-docs-website/
├── src/
│   ├── App.jsx              # Root router — defines all page routes
│   ├── components/
│   │   └── Layout.jsx       # Shell: header, sidebar navigation, content area
│   ├── pages/               # Route-level page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Docs.jsx         # Documentation index
│   │   └── Reference.jsx    # API reference
│   ├── data/
│   │   ├── docs/            # Guide content as JS data (arrays/objects)
│   │   └── reference/       # API reference content as JS data
│   └── ...
├── public/                  # Static assets
├── vercel.json              # Vercel deployment config with security headers
├── vite.config.js           # Vite build config
└── package.json
```

## Routing

Routes are defined in `App.jsx` using React Router 7. The `Layout` component wraps all doc pages and provides:
- Responsive header with navigation links
- Sidebar with section navigation
- Main content area

## Content Structure

Content is stored as JavaScript data objects in `src/data/` — not MDX or Markdown files. This means:
- Adding a new guide = add an entry to the relevant `src/data/docs/` file
- Adding a new API reference entry = add to `src/data/reference/`
- Pages read from these data arrays and render them dynamically

## Syntax Highlighting

Code blocks use **Prism React Renderer**. Supported languages include Kotlin, JSON, shell, and JavaScript. Code examples are embedded as strings in the data files.

## Animations

Page transitions and interactive elements use **Framer Motion**. Keep animations subtle — documentation sites should prioritize readability.

## Deployment

- Deployed via **Vercel** with config in `vercel.json`
- `vercel.json` sets security headers (CSP, X-Frame-Options, etc.)
- No server-side rendering — purely static SPA with client-side routing
- Vercel rewrites all routes to `index.html` for SPA routing

## Development

```bash
cd ketoy-docs-website
npm install
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

## Important Notes

- Content lives in JS data files, not Markdown/MDX. When adding documentation, edit the appropriate file in `src/data/`.
- The site references code examples showing Ketoy SDK usage — keep these in sync with the actual SDK API when the SDK changes.
- Security headers in `vercel.json` should not be loosened without a good reason.
- This is a standalone project — it is not part of the Gradle build and has no dependency on the Android modules.
