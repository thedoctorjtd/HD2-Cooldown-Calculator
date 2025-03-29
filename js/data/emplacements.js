// emplacements.js
const baseEmplacements = [
  {
    name: "E/MG-101 HMG Emplacement",
    baseCooldown: 180,
    type: "unlimited",
  },
  {
    name: "E/AT-12 Anti-Tank Emplacement",
    baseCooldown: 180,
    type: "unlimited",
  },
  {
    name: "E/GL-21 Grenadier Battlement",
    baseCooldown: 180,
    type: "unlimited",
  },
  {
    name: "FX-12 Shield Generator Relay",
    baseCooldown: 90,
    type: "unlimited",
  },
  {
    name: "A/ARC-3 Tesla Tower",
    baseCooldown: 120,
    type: "unlimited",
  },
  {
    name: "MD-6 Anti-Personnel Minefield",
    baseCooldown: 120,
    type: "unlimited",
  },
  {
    name: "MD-14 Incendiary Mines",
    baseCooldown: 120,
    type: "unlimited",
  },
  {
    name: "MD-8 Gas Mines",
    baseCooldown: 120,
    type: "unlimited",
  },
  {
    name: "MD-17 Anti-Tank Mines",
    baseCooldown: 120,
    type: "unlimited",
  },
];

export const EMPLACEMENTS = baseEmplacements.map((emplacement) => ({
  ...emplacement,
  category: "emplacements",
}));
