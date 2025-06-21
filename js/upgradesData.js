// Data for ship upgrades and progression ordering
// Extracted from upgrades.js for shared access

/************************************
 * MASTER LIST OF ALL UPGRADES
 ************************************/
export const ALL_UPGRADES = [
  // Patriotic Administration Center
  {
    id: "AdministrationCenter-1",
    category: "Patriotic Administration Center",
    shortName: "Donation Access License",
    description:
      "Support Weapons deploy with maximum magazines (for backpack weapons)",
    pages: ["rockets"],
  },
  {
    id: "AdministrationCenter-2",
    category: "Patriotic Administration Center",
    shortName: "Streamlined Request Process",
    description: "Decreases Support Weapon cooldown by 10%",
    pages: ["stratagems", "rockets"],
  },
  {
    id: "AdministrationCenter-3",
    category: "Patriotic Administration Center",
    shortName: "Hand Carts",
    description: "Decreases Backpack stratagem cooldown by 10%",
    pages: ["stratagems"],
  },
  {
    id: "AdministrationCenter-4",
    category: "Patriotic Administration Center",
    shortName: "Superior Packing Methodology",
    description:
      "Each resupply fully replenishes backpack ammo instead of half",
    pages: ["rockets"],
  },
  {
    id: "AdministrationCenter-5",
    category: "Patriotic Administration Center",
    shortName: "Payroll Management System",
    description: "Reduces reload time for all backpack support weapons by 10%",
    pages: ["rockets"],
  },

  // Orbital Cannons (Stratagems only)
  {
    id: "OrbitalCannons-1",
    category: "Orbital Cannons",
    shortName: "Zero-G Breech Loading",
    description: "Orbital stratagem cooldown -10%",
    pages: ["stratagems"],
  },

  // Hangar (Stratagems only)
  {
    id: "Hangar-1",
    category: "Hangar",
    shortName: "Liquid-Ventilated Cockpit",
    description: "Eagle cooldown -50% between uses",
    pages: ["stratagems"],
  },
  {
    id: "Hangar-2",
    category: "Hangar",
    shortName: "Pit Crew Hazard Pay",
    description: "Eagle Re-arm time -20%",
    pages: ["stratagems"],
  },
  {
    id: "Hangar-3",
    category: "Hangar",
    shortName: "Expanded Weapons Bay",
    description: "Eagle uses per re-arm +1",
    pages: ["stratagems"],
  },
  {
    id: "Hangar-4",
    category: "Hangar",
    shortName: "Advanced Crew Training",
    description: "Re-arm -10% if called in early",
    pages: ["stratagems"],
  },

  // Bridge
  {
    id: "Bridge-1",
    category: "Bridge",
    shortName: "Morale Augmentation",
    description: "All stratagem cooldowns -5%",
    pages: ["stratagems", "rockets"],
  },

  // Engineering Bay
  {
    id: "EngineeringBay-1",
    category: "Engineering Bay",
    shortName: "Synthetic Supplementation",
    description: "Sentry/Emplacement/Resupply cooldown -10%",
    pages: ["stratagems", "rockets"],
  },
  {
    id: "EngineeringBay-2",
    category: "Engineering Bay",
    shortName: "Streamlined Launch Process",
    description: "Removes call-in delay for support weapon stratagems",
    pages: ["rockets"],
  },
];

/************************************
 * UPGRADE PROGRESSION ORDERING
 ************************************/
export const upgradeProgressions = {
  PatrioticAdministrationCenter: [
    "AdministrationCenter-1",
    "AdministrationCenter-2",
    "AdministrationCenter-3",
    "AdministrationCenter-4",
    "AdministrationCenter-5",
  ],
  OrbitalCannons: ["OrbitalCannons-1"],
  Hangar: ["Hangar-1", "Hangar-2", "Hangar-3", "Hangar-4"],
  Bridge: ["Bridge-1"],
  EngineeringBay: ["EngineeringBay-1", "EngineeringBay-2"],
  // New rocket-only modules do not require linear progression
};
