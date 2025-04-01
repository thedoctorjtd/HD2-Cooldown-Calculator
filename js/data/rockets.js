// rockets.js
import { SUPPORT_WEAPONS } from "./supportWeapons.js";

const baseRockets = [
  {
    name: "EAT-17 Expendable Anti-Tank",
    type: "Expendable",
    stratCooldown: SUPPORT_WEAPONS.find(
      (weapon) => weapon.name === "EAT-17 Expendable Anti-Tank"
    ).baseCooldown,
    stratCallInTime: 2,
    reloadTime: 1,
    weaponChargeUp: 1,
    weaponDamage: 2000,
    rounds: 2,
  },
  {
    name: "MLS-4X Commando",
    type: "Expendable",
    stratCooldown: SUPPORT_WEAPONS.find(
      (weapon) => weapon.name === "MLS-4X Commando"
    ).baseCooldown,
    stratCallInTime: 3,
    reloadTime: 1,
    weaponChargeUp: 0,
    weaponDamage: 1100,
    rounds: 4,
  },
  {
    name: "GR-8 Recoilless Rifle",
    type: "Backpack",
    stratCooldown: SUPPORT_WEAPONS.find(
      (weapon) => weapon.name === "GR-8 Recoilless Rifle"
    ).baseCooldown,
    stratCallInTime: 3,
    reloadTime: 3.6,
    weaponChargeUp: 0,
    weaponDamage: 3200,
    rounds: 6,
  },
  {
    name: "FAF-14 Spear",
    type: "Backpack",
    stratCooldown: SUPPORT_WEAPONS.find(
      (weapon) => weapon.name === "FAF-14 Spear"
    ).baseCooldown,
    stratCallInTime: 3,
    reloadTime: 3.6,
    weaponChargeUp: 0,
    weaponDamage: 4000,
    rounds: 4,
  },
  {
    name: "LAS-99 Quasar Cannon",
    type: "Energy",
    stratCooldown: SUPPORT_WEAPONS.find(
      (weapon) => weapon.name === "LAS-99 Quasar Cannon"
    ).baseCooldown,
    stratCallInTime: 3,
    reloadTime: 15,
    weaponChargeUp: 3,
    weaponDamage: 2000,
    rounds: 1,
  },
];

export const ROCKETS = baseRockets.map((rocket) => ({
  ...rocket,
  travelTime: 4.75,
}));
