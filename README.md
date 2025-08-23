# Weekly Planner Generator

Generate beautiful, print‑ready weekly planners as PDFs with customizable layouts, languages, paper sizes, time intervals, and optional note/reflection pages.

## Features
- Print‑ready PDF export using jsPDF (A3 or A4 sizes)
- Flexible week configuration:
  - Select start/end months and year
  - Choose week start day and week end day (e.g., Monday–Friday)
  - Show/hide header and grid lines
- Time grid customization:
  - Start/end hours, 12h/24h format, and interval (10/15/20/30/60 minutes)
- Multilingual day/month labels (en, es, fr, de)
- Extra pages per week:
  - Planning page before the week
  - Reflection page after the week
- Live preview and clean UI built with React and shadcn‑ui

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS + shadcn‑ui
- jsPDF
- date‑fns

## Getting Started
Prerequisites:
- Node.js (LTS recommended) and npm installed

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app runs on http://localhost:8080 by default.

## Usage
1. Open the app in your browser.
2. Configure your planner in the Configuration panel:
   - Year, start month, end month
   - Paper size (A3 or A4) and language
   - Show grid, show header
   - Start hour, end hour, hour format (12/24), time intervals
   - Week start day and week end day
3. Review the live preview.
4. Click “Generate PDF” to download your planner.

The generated filename includes the year and paper size, for example: `weekly-planner-2025-a4.pdf`.

## Project Structure
- `src/components/PlannerGenerator.tsx` — Main component with configuration, preview, and generate button
- `src/lib/pdf-generator.ts` — PDF generation logic (weekly pages, planning and reflection pages)
- `index.html` — App metadata
- `tailwind.config.ts` — Tailwind configuration

## Build
Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Customization Tips
- Update translations or add new languages in `src/lib/pdf-generator.ts` (TRANSLATIONS section).
- Adjust styles via Tailwind CSS and component classes.
- Modify default configuration in `PlannerGenerator.tsx` initial state.

## License
This project is provided as‑is. Add your preferred license here if applicable.
