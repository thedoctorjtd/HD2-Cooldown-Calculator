# AGENTS Instructions

This repository contains a small web application for calculating Helldivers 2 stratagem and rocket cooldowns. JavaScript modules live under `js/` and data files under `js/data/`. The site can be opened directly via `index.html`.

## Key JavaScript Files

- `js/main.js`
  - Initializes the page, handles tab switching, and renders the global upgrades accordion.
  - Persists selected upgrades in `localStorage` and exposes helper functions for saving/loading them.
- `js/rocketsPage.js`
  - Recalculates maximum rocket shots when mission settings or upgrades change.
  - Updates the Rockets results UI with computed values.
- `js/rocketsCalculations.js`
  - Pure functions for computing rocket shot counts.
- `js/upgrades.js`
  - Contains the master list of ship upgrades.
  - Exports utility functions such as `getUpgradeEffects` and `enforceUpgradeProgressions` used across the app.
- `js/utils/`
  - Directory for reusable helpers like DOM manipulation utilities.

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
- See `README.md` for general project information and contributing guidelines.

## Running Locally

Open `index.html` in a browser or serve the directory with a simple HTTP server (e.g., `npx serve`) to view the app locally.
