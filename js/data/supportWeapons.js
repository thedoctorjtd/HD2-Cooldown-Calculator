// supportWeapons.js
const baseSuppWeapons = [
  {
    name: "EAT-17 Expendable Anti-Tank",
    baseCooldown: 70,
    type: "unlimited",
  },
  {
    name: "MLS-4X Commando",
    baseCooldown: 120,
    type: "unlimited",
  },
  {
    name: "M-105 Stalwart",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "MG-43 Machine Gun",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "MG-206 Heavy Machine Gun",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "GR-8 Recoilless Rifle",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "FAF-14 Spear",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "LAS-99 Quasar Cannon",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "LAS-98 Laser Cannon",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "APW-1 Anti-Materiel Rifle",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "RS-422 Railgun",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "AC-8 Autocannon",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "RL-77 Airburst Rocket Launcher",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "SIA-X3 W.A.S.P. Launcher",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "GL-21 Grenade Launcher",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "ARC-3 Arc Thrower",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "FLAM-40 Flamethrower",
    baseCooldown: 480,
    type: "unlimited",
  },
  {
    name: "TX-41 Sterilizer",
    baseCooldown: 480,
    type: "unlimited",
  },
];

export const SUPPORT_WEAPONS = baseSuppWeapons.map((weapon) => ({
  ...weapon,
  category: "support weapons",
}));
