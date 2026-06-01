# BAIO Frontend - Student & Information Portal

This is the public student portal for the Bharat AI Olympiad (BAIO) platform, built on React, Vite, and Tailwind CSS v4.

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
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

- `src/assets`: Logos and imagery assets.
- `src/components`: Generic inputs, buttons, wrappers, and dialogs.
- `src/context`: React global context interfaces.
- `src/features`: Domain specific logical directories (`auth`, `olympiads`, `registrations`, `results`).
- `src/hooks`: Global custom React hooks.
- `src/layouts`: Component screen layout wrappers.
- `src/pages`: Navigable view targets.
- `src/services`: Central Axios API adapters.
- `src/store`: Global state variables using Zustand.
- `src/styles`: Tailwind v4 stylesheet index.
- `src/utils`: Reusable string formatters and functions.
