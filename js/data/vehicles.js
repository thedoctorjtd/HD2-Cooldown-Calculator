// vehicles.js
const baseVehicles = [
  {
    name: "EXO-45 Patriot Exosuit",
    baseCooldown: 600,
    type: "limited",
    maxUses: 2,
  },
  {
    name: "EXO-49 Emancipator Exosuit",
    baseCooldown: 600,
    type: "limited",
    maxUses: 2,
  },
  {
    name: "M-102 Fast Recon Vehicle",
    baseCooldown: 480,
    type: "unlimited",
  },
];

export const VEHICLES = baseVehicles.map((vehicle) => ({
  ...vehicle,
  category: "vehicles",
}));
