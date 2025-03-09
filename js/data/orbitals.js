// orbitals.js
const baseOrbitals = [
  {
    name: "Orbital Gatling Barrage",
    baseCooldown: 70,
    type: "unlimited",
  },
  {
    name: "Orbital Airburst Strike",
    baseCooldown: 100,
    type: "unlimited",
  },
  {
    name: "Orbital 120mm HE Barrage",
    baseCooldown: 180,
    type: "unlimited",
  },
  {
    name: "Orbital 380mm HE Barrage",
    baseCooldown: 240,
    type: "unlimited",
  },
  {
    name: "Orbital Walking Barrage",
    baseCooldown: 240,
    type: "unlimited",
  },
  {
    name: "Orbital Laser",
    baseCooldown: 300,
    type: "limited",
    maxUses: 3,
  },
  {
    name: "Orbital Napalm Barrage",
    baseCooldown: 240,
    type: "unlimited",
  },
  {
    name: "Orbital Railcannon Strike",
    baseCooldown: 210,
    type: "unlimited",
  },
  {
    name: "Orbital Precision Strike",
    baseCooldown: 90,
    type: "unlimited",
  },
  {
    name: "Orbital Gas Strike",
    baseCooldown: 75,
    type: "unlimited",
  },
  {
    name: "Orbital EMS Strike",
    baseCooldown: 75,
    type: "unlimited",
  },
  {
    name: "Orbital Smoke Strike",
    baseCooldown: 100,
    type: "unlimited",
  },
];

export const ORBITALS = baseOrbitals.map((orbital) => ({
  ...orbital,
  category: "orbitals",
}));
