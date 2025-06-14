// backpacks.js
const baseBackpacks = [
  {
    name: 'AX/AR-23 "Guard Dog"',
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: 'AX/LAS-5 "Guard Dog" Rover',
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: 'AX/TX-13 "Guard Dog" Dog Breath',
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: '"Guard Dog" K-9',
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "SH-32 Shield Generator Pack",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "B-1 Supply Pack",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "LIFT-850 Jump Pack",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "LIFT-860 Hover Pack",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "SH-20 Ballistic Shield Backpack",
    baseCooldown: 300,
    type: "unlimited",
  },
  {
    name: "SH-51 Directional Shield",
    baseCooldown: 300,
    type: "unlimited",
  },
];

export const BACKPACKS = baseBackpacks.map((backpack) => ({
  ...backpack,
  category: "backpacks",
}));
