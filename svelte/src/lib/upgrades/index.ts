import { ALL_UPGRADES, upgradeProgressions } from './data';

export { ALL_UPGRADES, upgradeProgressions };

/**
 * Calculate all upgrade effects from selected upgrade IDs.
 * @param {string[]} selectedUpgrades
 */
export interface UpgradeEffects {
  universalCooldownMult: number;
  supportWeaponCooldownMult: number;
  backpackCooldownMult: number;
  orbitalCooldownMult: number;
  sentryEmplacementResupplyCooldownMult: number;
  eagleUseCooldownMult: number;
  eagleRearmCooldownMult: number;
  eagleEarlyRearmMult: number;
  eagleUsesPerRearmBonus: number;
  donationAccess: boolean;
  superiorPacking: boolean;
  payrollReloadMult: number;
  streamlinedLaunch: boolean;
}

export function getUpgradeEffects(selectedUpgrades: string[]): UpgradeEffects {
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
    streamlinedLaunch: false // Streamlined Launch Process
  };

  selectedUpgrades.forEach((upg) => {
    switch (upg) {
      // Patriotic Administration Center
      case 'AdministrationCenter-2':
        effects.supportWeaponCooldownMult *= 0.9;
        break;
      case 'AdministrationCenter-3':
        effects.backpackCooldownMult *= 0.9;
        break;
      case 'AdministrationCenter-1':
        effects.donationAccess = true;
        break;
      case 'AdministrationCenter-4':
        effects.superiorPacking = true;
        break;
      case 'AdministrationCenter-5':
        effects.payrollReloadMult *= 0.9;
        break;

      // Orbital Cannons
      case 'OrbitalCannons-1':
        effects.orbitalCooldownMult *= 0.9;
        break;

      // Hangar
      case 'Hangar-1':
        effects.eagleUseCooldownMult *= 0.5;
        break;
      case 'Hangar-2':
        effects.eagleRearmCooldownMult *= 0.8;
        break;
      case 'Hangar-3':
        effects.eagleUsesPerRearmBonus += 1;
        break;
      case 'Hangar-4':
        effects.eagleEarlyRearmMult *= 0.9;
        break;

      // Bridge
      case 'Bridge-1':
        effects.universalCooldownMult *= 0.95;
        break;

      // Engineering Bay
      case 'EngineeringBay-1':
        effects.sentryEmplacementResupplyCooldownMult *= 0.9;
        break;

      // Streamlined Launch
      case 'EngineeringBay-2':
        effects.streamlinedLaunch = true;
        break;

      default:
        break;
    }
  });

  return effects;
}
