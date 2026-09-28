# Girijesh — Cybersecurity Portfolio

A responsive recreation of the supplied video reference, personalized for Girijesh. Static HTML, CSS, and JavaScript with locally hosted fonts; no package installation or build step required.

## Run

```sh
npm run dev
```

Open http://127.0.0.1:5173. Deploy the contents of `dist/` to any static web host. Sites identity and output configuration are in `.openai/hosting.json`.

## Edit

- `dist/index.html`: identity, project cards, descriptions, expertise, and contact address.
- `dist/style.css`: typography, layout, colors, responsive breakpoints, and reduced-motion layout.
- `dist/app.js`: entrance, variable-font animation, atmospheric canvas, scroll transition, menu, and email draft.
- `dist/assets/`: local fonts and philosophy photograph.

The contact form opens a prefilled email in the visitor's email app. It does not claim delivery or require a server. The direct email link is also provided.

Project cards link to the user's four public repositories. Their graphic covers are editorial project summaries, not screenshots or simulated running products. Descriptions are based on the repository READMEs. No employment history, performance statistics, or location has been invented.

Visual reference: the user's supplied video and https://jishnu-mondal-portfolio.vercel.app/ (now redirects to https://jishnumondal.vercel.app/). The philosophy photograph is retained from that reference for fidelity. Fonts: Roboto Flex, Poppins, Josefin Sans, Inter, and Space Grotesk, distributed through Google Fonts. No source-site tracking, contact endpoints, scripts, or personal identity were copied.

## Checks

```sh
npm run check
```

Keyboard-accessible native dialog navigation; visible focus states; local asset loading; small-screen layout; reduced-motion support; form validation; and real repository links.
