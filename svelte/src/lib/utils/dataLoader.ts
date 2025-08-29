import orbitals from '$lib/data/orbitals.json';
import eagles from '$lib/data/eagles.json';
import supportWeapons from '$lib/data/supportWeapons.json';
import backpacks from '$lib/data/backpacks.json';
import sentries from '$lib/data/sentries.json';
import emplacements from '$lib/data/emplacements.json';
import vehicles from '$lib/data/vehicles.json';
import miscellaneous from '$lib/data/miscellaneous.json';
import rockets from '$lib/data/rockets.json';
import type { Stratagem } from '$lib/stratagems/calculations';
export type Rocket = Record<string, unknown>;

export const STRATAGEM_LISTS: Stratagem[][] = [
  orbitals as Stratagem[],
  eagles as Stratagem[],
  supportWeapons as Stratagem[],
  backpacks as Stratagem[],
  sentries as Stratagem[],
  emplacements as Stratagem[],
  vehicles as Stratagem[],
  miscellaneous as Stratagem[]
];

export function loadAllStratagems(): Stratagem[] {
  // Static import — no async needed; mirrors legacy shape
  return STRATAGEM_LISTS.flat();
}

export const ROCKETS: Rocket[] = rockets as Rocket[];

