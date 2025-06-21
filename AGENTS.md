# AGENTS Instructions
This repository contains a small web application for calculating Helldivers 2 stratagem and rocket cooldowns. JavaScript modules live under `js/` and JSON data lives under `data/`. The site can be opened directly via `index.html`.

## Key JavaScript Files
- `js/main.js`
  - Main entry point. Initializes the page, handles tab switching, and manages global upgrades.
- `js/rocketsPage.js`
  - Handles Rockets tab UI and logic, including recalculating and displaying rocket shot counts.
- `js/stratagemsPage.js`
  - Handles Stratagems tab UI and logic.
- `js/rocketsCalculations.js`
  - Pure functions for rocket shot calculations.
- `js/upgrades.js`
  - Upgrade logic and utility functions.
- `js/upgradesData.js`
  - Data for ship upgrades.
- `data/`
  - JSON files for stratagem, weapon, and vehicle data. Loaded at runtime via `loadJson` in `js/utils/dataLoader.js`.
- `js/utils/dataLoader.js`
  - Provides `loadJson` for fetching JSON in browsers or Node and `loadAllStratagems` which combines category files.
- `js/utils/`
  - Reusable helpers (e.g., DOM utilities in `domUtils.js`, local storage in `storage.js`).

## Testing
- Ensure you have Node (version 20 or later recommended).
- Run tests with:
  ```bash
  npm test
  ```
  This executes the Node `--test` suite found in the `tests/` directory. All tests should pass before committing changes.

## Development Tips
- JavaScript uses two space indentation and ECMAScript modules (`type: "module"`).
- No build step is required; HTML loads scripts directly.
- Assets reside in `images/` and styles in `css/`.

## Running Locally
Open `index.html` in a browser or serve the directory with a simple HTTP server (e.g., `npx serve`) to view the app locally.
