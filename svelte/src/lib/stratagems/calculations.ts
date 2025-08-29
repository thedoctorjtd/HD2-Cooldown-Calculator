import type { UpgradeEffects } from '$lib/upgrades';

// Data uses 'unlimited' for non-limited, non-eagle stratagems.
export type StratagemType = 'unlimited' | 'limited' | 'eagle';

export interface BaseStratagem {
  name: string;
  category: string;
  type: 'unlimited' | 'limited';
  baseCooldown?: number; // regular/limited
  maxUses?: number; // limited
}

export interface EagleStratagem {
  name: string;
  category: string;
  type: 'eagle';
  singleUseCd: number;
  rearmCd: number;
  baseUsesPerRearm: number;
}

export type Stratagem = BaseStratagem | EagleStratagem;

export interface StratagemOptions {
  orbitalFluctuations: boolean;
  dssPresence: boolean;
}

export function calculateCooldown(
  stratagem: Stratagem,
  effects: UpgradeEffects,
  opts: StratagemOptions
): number {
  const cat = (stratagem.category || '').toLowerCase();
  const of = opts.orbitalFluctuations ? 1.25 : 1;

  if (stratagem.type === 'eagle') {
    let cd = stratagem.singleUseCd * effects.universalCooldownMult * effects.eagleUseCooldownMult;
    cd *= of;
    return Math.round(cd);
  }

  let cd = (stratagem.baseCooldown || 0) * effects.universalCooldownMult;
  if (cat === 'support weapons') {
    cd *= effects.supportWeaponCooldownMult;
  } else if (cat === 'backpacks') {
    cd *= effects.backpackCooldownMult;
  } else if (cat === 'orbitals') {
    cd *= effects.orbitalCooldownMult;
  } else if (['sentries', 'emplacements', 'miscellaneous'].includes(cat)) {
    cd *= effects.sentryEmplacementResupplyCooldownMult;
  }

  if (
    opts.dssPresence &&
    cat === 'vehicles' &&
    stratagem.name.toLowerCase().includes('exosuit')
  ) {
    cd *= 0.5;
  }

  cd *= of;
  return Math.round(cd);
}

export function computeUsesForRegular(
  stratagem: Stratagem,
  finalCooldown: number,
  totalTime: number
): number {
  if (finalCooldown <= 0) return 0;
  let uses = 1 + Math.floor(totalTime / finalCooldown);
  if (stratagem.type === 'limited' && stratagem.maxUses !== undefined) {
    uses = Math.min(uses, stratagem.maxUses);
  }
  return uses;
}

export function computeUsesForEagle(
  stratagem: EagleStratagem,
  effects: UpgradeEffects,
  opts: StratagemOptions,
  totalTime: number
): number {
  const singleCd = calculateCooldown(stratagem, effects, opts);
  let baseRearmCd = Math.round(
    stratagem.rearmCd * effects.eagleRearmCooldownMult * (opts.orbitalFluctuations ? 1.25 : 1)
  );
  const usesPerRearm = stratagem.baseUsesPerRearm + effects.eagleUsesPerRearmBonus;
  let time = 0,
    totalUses = 0;
  while (true) {
    for (let i = 0; i < usesPerRearm; i++) {
      if (time > totalTime) return totalUses;
      totalUses++;
      time += singleCd;
    }
    if (time > totalTime) return totalUses;
    time += baseRearmCd;
  }
}

export function filterStratagems(stratagems: Stratagem[], filterText: string): Stratagem[] {
  if (!filterText) return stratagems;
  const search = filterText.toLowerCase();
  return stratagems.filter(
    (s) => s.name.toLowerCase().includes(search) || s.category.toLowerCase().includes(search)
  );
}
