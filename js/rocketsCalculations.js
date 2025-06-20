// Computation utilities for rocket shot counts

export function computeExpendableShots(weapon, totalTime, options = {}) {
  const {
    effects = {},
    complexPlotting = false,
    orbitalFluctuations = false,
  } = options;
  const effectiveRounds =
    weapon.weaponDamage < 2000 ? Math.floor(weapon.rounds / 2) : weapon.rounds;
  const callInDelay = effects.streamlinedLaunch ? 0 : weapon.stratCallInTime;
  let baseCallTime = callInDelay + weapon.travelTime;
  if (complexPlotting) baseCallTime *= 1.5;
  let scd =
    weapon.stratCooldown *
    (effects.supportWeaponCooldownMult ?? 1) *
    (effects.universalCooldownMult ?? 1);
  if (orbitalFluctuations) scd *= 1.25;

  let time = baseCallTime;
  let shots = 0;
  if (time <= totalTime) {
    shots += effectiveRounds;
    while (true) {
      time += scd + baseCallTime;
      if (time > totalTime) break;
      shots += effectiveRounds;
    }
  }
  return shots;
}

export function computeBackpackShots(weapon, totalTime, options = {}) {
  const {
    effects = {},
    complexPlotting = false,
    orbitalFluctuations = false,
    resupplyCount = 1,
  } = options;
  const callInTime = effects.streamlinedLaunch ? 0 : weapon.stratCallInTime;
  let totalCallIn = callInTime + weapon.travelTime;
  if (complexPlotting) totalCallIn *= 1.5;
  if (totalCallIn > totalTime) return 0;

  const donation = effects.donationAccess;
  const superior = effects.superiorPacking;
  const payrollMult = effects.payrollReloadMult ?? 1;

  const initialAmmo = donation ? weapon.rounds : Math.ceil(weapon.rounds / 2);
  const refillAmmo = superior
    ? weapon.rounds - 1
    : Math.floor(weapon.rounds / 2);
  const shotReload = weapon.reloadTime * payrollMult;

  let baseResupplyCd = 180 * (effects.universalCooldownMult ?? 1);
  if ((effects.sentryEmplacementResupplyCooldownMult ?? 1) < 1) {
    baseResupplyCd *= 0.9;
  }
  if (orbitalFluctuations) baseResupplyCd *= 1.25;

  let resuppliesPerPod = resupplyCount;
  let time = totalCallIn;
  let shots = 0;
  let ammo = initialAmmo;
  let boxesUsedThisPod = 0;

  while (true) {
    if (ammo > 0) {
      shots++;
      ammo--;
      time += shotReload;
      if (time > totalTime) break;
    } else {
      if (boxesUsedThisPod < resuppliesPerPod) {
        ammo = refillAmmo;
        boxesUsedThisPod++;
      } else {
        time += baseResupplyCd;
        if (time > totalTime) break;
        boxesUsedThisPod = 0;
        ammo = initialAmmo;
      }
    }
    if (time > totalTime) break;
  }
  return shots;
}

export function computeEnergyShots(weapon, totalTime, options = {}) {
  const {
    effects = {},
    complexPlotting = false,
    planetWeather = "Normal",
  } = options;
  const callInTime = effects.streamlinedLaunch ? 0 : weapon.stratCallInTime;
  let totalCall = callInTime + weapon.travelTime;
  if (complexPlotting) totalCall *= 1.5;
  if (totalCall > totalTime) return 0;

  let baseCd = weapon.reloadTime;
  if (planetWeather === "Hot") {
    baseCd += 2.5;
  } else if (planetWeather === "Cold") {
    baseCd = Math.max(0, baseCd - 2.5);
  }
  let time = totalCall;
  let shots = 0;
  while (true) {
    time += weapon.weaponChargeUp;
    if (time > totalTime) break;
    shots++;
    time += baseCd;
    if (time > totalTime) break;
  }
  return shots;
}
