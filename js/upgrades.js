/************************************
 * MASTER LIST OF ALL UPGRADES
 ************************************/
export const ALL_UPGRADES = [
  // Patriotic Administration Center
  {
    id: "ShipModules-StreamlinedRequest",
    category: "Patriotic Administration Center",
    shortName: "Streamlined Request Process",
    description: "Decreases Support Weapon cooldown by 10%",
    pages: ["stratagems", "rockets"],
  },
  {
    id: "ShipModules-HandCarts",
    category: "Patriotic Administration Center",
    shortName: "Hand Carts",
    description: "Decreases Backpack stratagem cooldown by 10%",
    pages: ["stratagems"],
  },
  {
    id: "ShipModules-Donation",
    category: "Patriotic Administration Center",
    shortName: "Donation Access License",
    description:
      "Support Weapons deploy with maximum magazines (for backpack weapons)",
    pages: ["rockets"],
  },
  {
    id: "ShipModules-Superior",
    category: "Patriotic Administration Center",
    shortName: "Superior Packing Methodology",
    description:
      "Each resupply fully replenishes backpack ammo instead of half",
    pages: ["rockets"],
  },
  {
    id: "ShipModules-Payroll",
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
    id: "ShipModules-StreamlinedLaunch",
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
    "ShipModules-StreamlinedRequest",
    "ShipModules-HandCarts",
    "ShipModules-Donation",
    "ShipModules-Superior",
    "ShipModules-Payroll",
  ],
  OrbitalCannons: ["OrbitalCannons-1"],
  Hangar: ["Hangar-1", "Hangar-2", "Hangar-3", "Hangar-4"],
  Bridge: ["Bridge-1"],
  EngineeringBay: ["EngineeringBay-1", "ShipModules-StreamlinedLaunch"],
  // New rocket-only modules do not require linear progression
};

/************************************
 * CALCULATE UPGRADE EFFECTS
 ************************************/
export function getUpgradeEffects(selectedUpgrades) {
  const effects = {
    // Universal modifiers
    universalCooldownMult: 1.0,
    supportWeaponCooldownMult: 1.0,
    backpackCooldownMult: 1.0,
    orbitalCooldownMult: 1.0,
    sentryEmplacementResupplyCooldownMult: 1.0,

    // Eagle-specific modifiers
    eagleUseCooldownMult: 1.0,
    eagleRearmCooldownMult: 1.0,
    eagleEarlyRearmMult: 1.0,
    eagleUsesPerRearmBonus: 0,

    // Rocket-specific modifiers
    donationAccess: false, // Donation Access License
    superiorPacking: false, // Superior Packing Methodology
    payrollReloadMult: 1.0, // Payroll Management System
    streamlinedLaunch: false, // Streamlined Launch Process
  };

  selectedUpgrades.forEach((upg) => {
    switch (upg) {
      // Patriotic Administration Center
      case "ShipModules-StreamlinedRequest":
        effects.supportWeaponCooldownMult *= 0.9;
        break;
      case "ShipModules-HandCarts":
        effects.backpackCooldownMult *= 0.9;
        break;
      case "ShipModules-Donation":
        effects.donationAccess = true;
        break;
      case "ShipModules-Superior":
        effects.superiorPacking = true;
        break;
      case "ShipModules-Payroll":
        effects.payrollReloadMult *= 0.9;
        break;

      // Orbital Cannons
      case "OrbitalCannons-1":
        effects.orbitalCooldownMult *= 0.9;
        break;

      // Hangar
      case "Hangar-1":
        effects.eagleUseCooldownMult *= 0.5;
        break;
      case "Hangar-2":
        effects.eagleRearmCooldownMult *= 0.8;
        break;
      case "Hangar-3":
        effects.eagleUsesPerRearmBonus += 1;
        break;
      case "Hangar-4":
        effects.eagleEarlyRearmMult *= 0.9;
        break;

      // Bridge
      case "Bridge-1":
        effects.universalCooldownMult *= 0.95;
        break;

      // Engineering Bay
      case "EngineeringBay-1":
        effects.sentryEmplacementResupplyCooldownMult *= 0.9;
        break;

      // Streamlined Launch
      case "ShipModules-StreamlinedLaunch":
        effects.streamlinedLaunch = true;
        break;

      default:
        break;
    }
  });

  return effects;
}

/************************************
 * ENFORCE UPGRADE PROGRESSION
 ************************************/
export function enforceUpgradeProgressions(clickedId, isChecked) {
  for (const category in upgradeProgressions) {
    const progression = upgradeProgressions[category];
    const index = progression.indexOf(clickedId);
    if (index !== -1) {
      if (isChecked) {
        // Ensure all previous upgrades in the progression are enabled.
        for (let i = 0; i < index; i++) {
          const prevId = progression[i];
          const prevCheckbox = document.querySelector(
            `input[data-upgrade-id="${prevId}"]`
          );
          if (prevCheckbox) {
            prevCheckbox.checked = true;
          }
        }
      } else {
        // Uncheck all subsequent upgrades in the progression.
        for (let i = index + 1; i < progression.length; i++) {
          const nextId = progression[i];
          const nextCheckbox = document.querySelector(
            `input[data-upgrade-id="${nextId}"]`
          );
          if (nextCheckbox) {
            nextCheckbox.checked = false;
          }
        }
      }
      break;
    }
  }
}
