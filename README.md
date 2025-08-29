# Helldivers 2 Stratagem & Rocket Cooldown Calculator

A fan-made web app to calculate Helldivers 2 stratagem cooldowns and maximum rocket usage based on ship upgrades, mission settings, and other modifiers.
Live site: [https://hd2-cooldowns.the-doc.org](https://hd2-cooldowns.the-doc.org)

---

## About

This tool lets you select ship upgrades, toggle orbital fluctuations, and see calculated stratagem cooldowns and maximum rocket usage.
## Features

- Calculate cooldowns for all stratagems.
- Calculate maximum AT rocket usage.
- Select ship upgrades that affect cooldown times.
- Choose mission configuration options for stratagems and rockets to tailor the results.


## Contributing

Pull requests are welcome!
If you would like to add new features, fix bugs, or expand the data, feel free to open a PR.

## Development

The app now runs as a SvelteKit site under the `svelte/` directory using TypeScript and Tailwind.

Common commands (from repo root):

```bash
# start dev server (http://localhost:5173)
npm run dev

# build static site (output in svelte/build)
npm run build

# preview the production build
npm run preview
```

## Testing

This repo uses Node's built-in test runner for pure logic (no browser required). After installing Node 20+:

```bash
npm test
```

This runs the suites in the `tests/` directory and imports TypeScript directly via `tsx`.

Notes
- Global mission options like Orbital Fluctuations persist across routes and are shared between pages.
- The global “Select Your Ship Upgrades” accordion starts closed on load; stratagem category accordions default open and remember their state.

## License

This project is licensed under the **GNU Affero General Public License v3.0**.  
See the [LICENSE](./LICENSE) for details.

## Disclaimer

This is a **fan project** and is **not** officially affiliated with or endorsed by Arrowhead or any other company. All trademarks or copyrighted materials are property of their respective owners.
