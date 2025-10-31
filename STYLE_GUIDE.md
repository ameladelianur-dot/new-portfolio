Style Guide – Dark Mode Enforcement and Section Updates

Overview
This document records the UI/UX changes applied to enforce site-wide dark mode, fix Case Studies layout, and refresh the Connect section styling while maintaining accessibility (WCAG AA).

1) Dark Mode Enforcement
- Default theme: Dark (forced).
- Implementation:
  - fixes.js adds the `dark` class to `<html>` on load and persists `localStorage.theme = 'dark'`.
  - Removes any theme toggle UI if present (`#theme-toggle`, `.theme-toggle`, `[data-theme-toggle]`, etc.).
- Palette (reference):
  - Backgrounds: `from-dark-tertiary`, `via-dark-secondary`, `to-dark-primary`.
  - Text: `text-white`, `text-gray-300/400` for supporting copy.
  - Borders: `border-gray-700/50`.
  - Accents: gradients `from-purple-500 to-pink-500` and brand blues for social icons.

2) Case Studies Section – Layout and Display Fixes
- Goals: consistent card styling, constrained images, accessible links.
- Implementation:
  - Images normalized via JS: `w-full h-64 object-cover rounded-xl shadow-md`, `aspect-ratio: 16/9`, `max-height: 320px`, `loading="lazy"`.
  - Cards normalized: `bg-dark-secondary border border-gray-700/50 rounded-2xl overflow-hidden`.
  - Links updated: `rel="noopener"` and `aria-label` improvements when opening in a new tab.
- Accessibility:
  - Cards receive `tabindex="0"` for keyboard navigation.
  - Maintain sufficient color contrast (AA) for text and interactive elements.

3) Connect Section – Dark Palette Refresh
- Section background: dark gradient (`from-dark-tertiary via-dark-secondary to-dark-primary`).
- Headings: `text-white`; copy: `text-gray-300/400`.
- Info blocks: `bg-dark-secondary/70` with `border-gray-700/50`.
- Social container: `bg-dark-tertiary/50` and consistent icon gradients.
- Form fields: `bg-dark-tertiary/60`, `border-gray-600`, `text-white`, `placeholder-gray-400` with `focus:ring-purple-500`.

4) Testing and Compatibility
- Responsive checks across common breakpoints (sm, md, lg, xl).
- Cross-browser: Chrome, Firefox, Safari.
- Ensure animations (AOS) and existing scripts continue functioning.

5) Future Maintenance
- New components should use the dark palette by default and avoid mixing light-only utility classes.
- Prefer semantic HTML and keyboard accessibility (tabindex, aria-labels) for interactive tiles.
- Keep gradients for brand accents; avoid heavy white surfaces.

Change Log
- 2025-10-29: Enforced dark mode, removed toggle UI, stabilized Case Studies layout, refreshed Connect section styles, added accessibility improvements.