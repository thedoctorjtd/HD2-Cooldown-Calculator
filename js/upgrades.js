// upgrades.js

export const upgradeProgressions = {
  PatrioticAdministrationCenter: [
    "PatrioticAdministrationCenter-1",
    "PatrioticAdministrationCenter-2",
  ],
  OrbitalCannons: ["OrbitalCannons-1"],
  Hangar: ["Hangar-1", "Hangar-2", "Hangar-3", "Hangar-4"],
  Bridge: ["Bridge-1"],
  EngineeringBay: ["EngineeringBay-1"],
};

/**
 * Returns all upgrade effects in a single object.
 */
export function getUpgradeEffects(selectedUpgrades) {
  let effects = {
    universalCooldownMult: 1.0,
    supportWeaponCooldownMult: 1.0,
    backpackCooldownMult: 1.0,
    orbitalCooldownMult: 1.0,
    sentryEmplacementResupplyCooldownMult: 1.0,

    // Eagle-specific
    eagleUseCooldownMult: 1.0,
    eagleRearmCooldownMult: 1.0,
    eagleEarlyRearmMult: 1.0,
    eagleUsesPerRearmBonus: 0,
  };

  selectedUpgrades.forEach((upg) => {
    switch (upg) {
      // Patriotic Administration Center
      case "PatrioticAdministrationCenter-1":
        effects.supportWeaponCooldownMult *= 0.9;
        break;
      case "PatrioticAdministrationCenter-2":
        effects.backpackCooldownMult *= 0.9;
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

      default:
        break;
    }
  });

  return effects;
}

/**
 * Enforce linear progression
 */
export function enforceUpgradeProgressions(clickedId, isChecked) {
  for (let category in upgradeProgressions) {
    let arr = upgradeProgressions[category];
    let idx = arr.indexOf(clickedId);
    if (idx !== -1) {
      if (isChecked) {
        // Check all previous
        for (let i = 0; i < idx; i++) {
          let prevId = arr[i];
          document.querySelector(
            `input[data-upgrade-id="${prevId}"]`
          ).checked = true;
        }
      } else {
        // Uncheck all following
        for (let i = idx + 1; i < arr.length; i++) {
          let nextId = arr[i];
          document.querySelector(
            `input[data-upgrade-id="${nextId}"]`
          ).checked = false;
        }
      }
      break;
    }
  }
}
