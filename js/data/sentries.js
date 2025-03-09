// sentries.js
const baseSentries = [
  {
    name: "A/MG-43 Machine Gun Sentry",
    baseCooldown: 90,
    type: "unlimited",
  },
  {
    name: "A/G-16 Gatling Sentry",
    baseCooldown: 150,
    type: "unlimited",
  },
  {
    name: "A/M-12 Mortar Sentry",
    baseCooldown: 180,
    type: "unlimited",
  },
  {
    name: "A/M-23 EMS Mortar Sentry",
    baseCooldown: 180,
    type: "unlimited",
  },
  {
    name: "A/AC-8 Autocannon Sentry",
    baseCooldown: 150,
    type: "unlimited",
  },
  {
    name: "A/MLS-4X Rocket Sentry",
    baseCooldown: 150,
    type: "unlimited",
  },
  {
    name: "A/FLAM-40 Flame Sentry",
    baseCooldown: 150,
    type: "unlimited",
  },
];

export const SENTRIES = baseSentries.map((sentry) => ({
  ...sentry,
  category: "sentries",
}));
