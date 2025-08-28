import { derived } from 'svelte/store';
import { persistedWritable } from './persisted';
import {
  getUpgradeEffects,
  upgradeProgressions,
  type UpgradeEffects
} from '$lib/upgrades';

export const selectedUpgrades = persistedWritable<string[]>(
  'selectedUpgrades',
  []
);

export const upgradeEffects = derived<typeof selectedUpgrades, UpgradeEffects>(
  selectedUpgrades,
  ($ids) => getUpgradeEffects($ids)
);

/** Enforce progression when setting an upgrade's checked state */
export function setUpgrade(id: string, checked: boolean) {
  selectedUpgrades.update((prev) => {
    const next = new Set(prev);

    for (const progression of Object.values(upgradeProgressions)) {
      const idx = progression.indexOf(id);
      if (idx !== -1) {
        if (checked) {
          for (let i = 0; i <= idx; i++) next.add(progression[i]);
        } else {
          for (let i = idx; i < progression.length; i++) next.delete(progression[i]);
        }
        return Array.from(next);
      }
    }

    // Not in a known progression; simple toggle
    if (checked) next.add(id);
    else next.delete(id);
    return Array.from(next);
  });
}

export function clearUpgrades() {
  selectedUpgrades.set([]);
}

