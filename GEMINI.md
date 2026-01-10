# OrcaInsta - Project Context

## Project Overview

**OrcaInsta** is a React-based web application designed for creating beautiful, social-media-friendly "long images" from Markdown text. It serves as a specialized editor where users can write content, apply themes, and export high-quality images suitable for platforms like Instagram, WeChat, or Twitter.

While the project name and some documentation references "Gemini" or "AI Studio", the codebase indicates that direct AI integration has been deprecated/removed. The application currently functions as a standalone formatting and design tool.

### Key Features
*   **Split-Pane Editor:** Real-time Markdown editing and visual preview.
*   **Theming Engine:** Support for multiple visual themes (Light, Dark, Paper, Forest, Gradient) controlling colors, backgrounds, and typography.
*   **Typography Control:** Adjustable font sizes and line heights.
*   **Smart Formatting:** "Space Fix" utility (`textUtils.ts`) that automatically optimizes spacing between CJK characters, English words, and numbers.
*   **High-Res Export:** Client-side generation of Retina-quality PNGs using `html-to-image`.

## Tech Stack

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (with `@tailwindcss/typography` plugin)
*   **Icons:** Lucide React
*   **Core Libraries:**
    *   `react-markdown`: For rendering the preview.
    *   `html-to-image`: For converting the DOM node to an image file.

## Project Structure

```text
/
├── App.tsx                 # Main application controller (State: markdown, theme, typography)
├── components/
│   ├── PreviewCard.tsx     # The visual component that gets exported as an image
│   └── Toolbar.tsx         # Top navigation bar with controls for themes/formatting
├── services/
│   ├── textUtils.ts        # Logic for auto-spacing CJK/English text
│   └── geminiService.ts    # [DEPRECATED] Empty file, previous AI integration
├── constants.ts            # Default Markdown content, Theme definitions, Format mappings
├── types.ts                # TypeScript interfaces (ThemeConfig, TypographyConfig)
└── index.css               # Global styles and Tailwind imports
```

## Development & Usage

### Prerequisites
*   Node.js (LTS recommended)

### Build & Run Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Install dependencies. |
| `npm run dev` | Start local development server (typically `http://localhost:5173`). |
| `npm run build` | Type-check (`tsc`) and build production assets via Vite. |
| `npm run preview` | Preview the production build locally. |

### Environment Variables
*   The `README.md` references `GEMINI_API_KEY` in `.env.local`, but this appears to be legacy as `geminiService.ts` is empty.

## Coding Conventions

*   **Styling:** Utility-first CSS using Tailwind. Custom themes are defined in `constants.ts` and applied via inline styles or conditional classes in components.
*   **State Management:** Local React state (`useState`) in `App.tsx` passed down via props.
*   **Typography:** Uses Tailwind's `prose` plugin for Markdown content styling.
*   **Export Logic:** Image generation happens entirely client-side. Special care is taken in `App.tsx` to handle CORS issues (skipping fonts/external stylesheets) during export.
