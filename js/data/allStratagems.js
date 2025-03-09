// allStratagems.js
// allStratagems.js
import { ORBITALS } from "./orbitals.js";
import { EAGLES } from "./eagles.js";
import { SUPPORT_WEAPONS } from "./supportWeapons.js";
import { BACKPACKS } from "./backpacks.js";
import { SENTRIES } from "./sentries.js";
import { EMPLACEMENTS } from "./emplacements.js";
import { VEHICLES } from "./vehicles.js";
import { MISC as MISCELLANEOUS } from "./miscellaneous.js";

export const STRATAGEMS = [
  ...ORBITALS,
  ...EAGLES,
  ...SUPPORT_WEAPONS,
  ...BACKPACKS,
  ...SENTRIES,
  ...EMPLACEMENTS,
  ...VEHICLES,
  ...MISCELLANEOUS,
];
