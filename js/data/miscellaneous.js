// miscellaneous.js
const baseMisc = [
  {
    name: "Ammo Resupply",
    baseCooldown: 180,
    category: "miscellaneous",
    type: "unlimited",
  },
  {
    name: "Hellbomb",
    baseCooldown: 30,
    category: "miscellaneous",
    type: "unlimited",
  },
];

export const MISC = baseMisc.map((misc) => ({
  ...misc,
  category: "miscellaneous",
}));
