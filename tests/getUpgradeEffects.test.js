import test from 'node:test';
import assert from 'node:assert/strict';
import { getUpgradeEffects } from '../js/upgrades.js';

test('Bridge-1 reduces universal cooldown by 5%', () => {
  const effects = getUpgradeEffects(['Bridge-1']);
  assert.equal(effects.universalCooldownMult, 0.95);
});

test('Streamlined Request reduces support weapon cooldown by 10%', () => {
  const effects = getUpgradeEffects(['AdministrationCenter-2']);
  assert.equal(effects.supportWeaponCooldownMult, 0.9);
});

test('Hangar-3 adds one Eagle use per rearm', () => {
  const effects = getUpgradeEffects(['Hangar-3']);
  assert.equal(effects.eagleUsesPerRearmBonus, 1);
});

test('multiple upgrades combine correctly', () => {
  const effects = getUpgradeEffects(['Hangar-1', 'Hangar-2']);
  assert.equal(effects.eagleUseCooldownMult, 0.5);
  assert.equal(effects.eagleRearmCooldownMult, 0.8);
});

