import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeExpendableShots,
  computeBackpackShots,
  computeEnergyShots,
} from '../js/rocketsCalculations.js';

test('computeExpendableShots basic scenario', () => {
  const weapon = {
    weaponDamage: 1000,
    rounds: 4,
    stratCallInTime: 2,
    travelTime: 3,
    stratCooldown: 6,
  };
  const options = { effects: {}, complexPlotting: false, orbitalFluctuations: false };
  const result = computeExpendableShots(weapon, 20, options);
  assert.equal(result, 4);
});

test('computeBackpackShots with one resupply', () => {
  const weapon = {
    stratCallInTime: 2,
    travelTime: 1,
    rounds: 2,
    reloadTime: 1,
  };
  const options = {
    effects: { donationAccess: true, payrollReloadMult: 1 },
    complexPlotting: false,
    orbitalFluctuations: false,
    resupplyCount: 1,
  };
  const result = computeBackpackShots(weapon, 10, options);
  assert.equal(result, 3);
});

test('computeEnergyShots normal weather', () => {
  const weapon = {
    stratCallInTime: 2,
    travelTime: 1,
    reloadTime: 4,
    weaponChargeUp: 1,
  };
  const options = { effects: {}, complexPlotting: false, planetWeather: 'Normal' };
  const result = computeEnergyShots(weapon, 15, options);
  assert.equal(result, 3);
});
