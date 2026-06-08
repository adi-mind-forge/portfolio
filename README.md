# Aditya Anand — Portfolio

> Converted from vanilla HTML/CSS/JS to Vite + React + Tailwind CSS

## Project Structure

```
portfolio/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # Root component — deck logic & state
    ├── index.css         # Tailwind + custom CSS (animations, 3D flip, etc.)
    ├── cardData.js       # Card definitions (content, colours, popup HTML)
    ├── assets/
    │   └── aditya.jpg    # Profile photo (extracted from original HTML)
    └── components/
        ├── Hero.jsx      # Left photo + right identity block
        ├── Card.jsx      # Single playing card (back + front + glitch layer)
        └── Popup.jsx     # Full-screen card expand overlay
```

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## How it works

The portfolio uses **anime.js** for all animations (same as the original), now loaded
lazily on first interaction. React manages UI state (which cards are dealt/flipped,
popup open/close, typewriter text, uptime counter). Tailwind is used for layout and
utilities; custom CSS in `index.css` handles the things Tailwind can't express
(3D card flip with `backface-visibility`, `::before`/`::after` scanline overlays,
keyframe animations).

### Interaction

| Action | Effect |
|--------|--------|
| Scroll ↓ / Arrow ↓ | Deal next card |
| Scroll ↓ (all dealt) | Flip all cards |
| Scroll ↓ (all flipped) | Highlight next card |
| Scroll ↑ | Navigate back / recall cards |
| Click card | Open popup |
| Escape / click outside | Close popup |
| Touch swipe ↑/↓ | Same as scroll |

## Customisation

- Edit **`src/cardData.js`** to update your name, bio, projects, skills, etc.
- Replace **`src/assets/aditya.jpg`** with your own photo.
- Update links in the Contact card (`popupContent` in `cardData.js`).
- The `ROLES` array in `Hero.jsx` controls the typewriter phrases.
