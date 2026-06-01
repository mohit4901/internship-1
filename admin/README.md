# BAIO Admin Dashboard - Control Panel

This is the administrative control console for the Bharat AI Olympiad (BAIO) platform, built on React, Vite, and Tailwind CSS v4.

## Setup Instructions

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Build the application for production:
   ```bash
   npm run build
   ```

## Folder Structure

- `src/assets`: UI theme assets.
- `src/components`: Generic admin dashboard components, lists, stats cards.
- `src/context`: React authentication contexts for admin.
- `src/features`: Domain specific logical directories (`auth`, `users`, `olympiads`, `registrations`, `results`).
- `src/hooks`: Global custom hooks.
- `src/layouts`: Component screen layout wrappers (Sidebar layouts).
- `src/pages`: Admin views.
- `src/services`: Central Axios API adapters.
- `src/store`: Global state variables using Zustand.
- `src/styles`: Tailwind v4 stylesheet index.
- `src/utils`: PDF generation, file formatters and CSV/Excel exports.
