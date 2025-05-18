import { ROCKETS } from "./data/rockets.js";
import { getUpgradeEffects } from "./upgrades.js";

/*********************************************************
 * UPDATE ROCKETS UI
 * Recalculates and renders rocket shot data based on:
 *   - Mission configuration settings,
 *   - Selected ship upgrades,
 *   - And weapon-specific parameters.
 *********************************************************/
export function updateRocketsUI() {
  const container = document.getElementById("rocketsResultsContainer");
  container.innerHTML = "";

  // Gather mission configuration settings.
  const orbitalFluctuations = document.getElementById(
    "orbitalFluctuationsCheckboxRockets"
  ).checked;
  const complexPlotting = document.getElementById(
    "complexPlottingCheckbox"
  ).checked;
  const planetWeather = document.getElementById("planetWeatherSelect").value;
  const resupplyCount = parseInt(
    document.getElementById("resupplyCountSelect").value,
    10
  );

  // Retrieve selected upgrades from global state.
  const selectedUpgrades = Array.from(
    document.querySelectorAll('input[type="checkbox"][data-upgrade-id]')
  )
    .filter((cb) => cb.checked)
    .map((cb) => cb.getAttribute("data-upgrade-id"));
  const effects = getUpgradeEffects(selectedUpgrades);

  // Define time periods (in seconds)
  const T5 = 300; // 5 minutes
  const T40 = 2400; // 40 minutes

  /***********************
   * CALCULATION FUNCTIONS
   ***********************/
  function computeExpendableShots(weapon, totalTime) {
    // Adjust effective rounds for low-damage weapons.
    const effectiveRounds =
      weapon.weaponDamage < 2000
        ? Math.floor(weapon.rounds / 2)
        : weapon.rounds;
    const callInDelay = effects.streamlinedLaunch ? 0 : weapon.stratCallInTime;
    let baseCallTime = callInDelay + weapon.travelTime;
    if (complexPlotting) baseCallTime *= 1.5;
    let scd =
      weapon.stratCooldown *
      effects.supportWeaponCooldownMult *
      effects.universalCooldownMult;
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

  function computeBackpackShots(weapon, totalTime) {
    const callInTime = effects.streamlinedLaunch ? 0 : weapon.stratCallInTime;
    let totalCallIn = callInTime + weapon.travelTime;
    if (complexPlotting) totalCallIn *= 1.5;
    if (totalCallIn > totalTime) return 0;

    const donation = effects.donationAccess;
    const superior = effects.superiorPacking;
    const payrollMult = effects.payrollReloadMult;

    // Initial ammo depends on the Donation upgrade.
    const initialAmmo = donation ? weapon.rounds : Math.ceil(weapon.rounds / 2);
    // Refill amount depends on Superior Packing upgrade.
    const refillAmmo = superior
      ? weapon.rounds - 1
      : Math.floor(weapon.rounds / 2);
    const shotReload = weapon.reloadTime * payrollMult;

    // Base resupply cooldown (modified if Engineering Bay upgrade applied).
    let baseResupplyCd = 180 * effects.universalCooldownMult;
    if (effects.sentryEmplacementResupplyCooldownMult < 1) {
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

  function computeEnergyShots(weapon, totalTime) {
    const callInTime = effects.streamlinedLaunch ? 0 : weapon.stratCallInTime;
    let totalCall = callInTime + weapon.travelTime;
    if (complexPlotting) totalCall *= 1.5;
    if (totalCall > totalTime) return 0;

    let baseCd = weapon.reloadTime;
    // Adjust cooldown based on planet weather.
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

  /***********************
   * BUILD RESULTS TABLE
   ***********************/
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Weapon", "Avg Sec/Shot", "Shots / 5 Min", "Shots / 40 Min"].forEach(
    (col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    }
  );
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  ROCKETS.forEach((weapon) => {
    const row = document.createElement("tr");
    const nameTd = document.createElement("td");
    nameTd.textContent = weapon.name;
    row.appendChild(nameTd);

    let shots5 = 0,
      shots40 = 0;
    if (weapon.type === "Expendable") {
      shots5 = computeExpendableShots(weapon, T5);
      shots40 = computeExpendableShots(weapon, T40);
    } else if (weapon.type === "Backpack") {
      shots5 = computeBackpackShots(weapon, T5);
      shots40 = computeBackpackShots(weapon, T40);
    } else if (weapon.type === "Energy") {
      shots5 = computeEnergyShots(weapon, T5);
      shots40 = computeEnergyShots(weapon, T40);
    }

    const avgSecPerShot = shots40 > 0 ? Math.round(T40 / shots40) : "∞";
    const avgTd = document.createElement("td");
    avgTd.textContent = avgSecPerShot;
    row.appendChild(avgTd);

    const s5Td = document.createElement("td");
    s5Td.textContent = shots5;
    row.appendChild(s5Td);

    const s40Td = document.createElement("td");
    s40Td.textContent = shots40;
    row.appendChild(s40Td);

    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

// Optional: Add any additional initialization logic for rocketsPage if needed.
window.addEventListener("DOMContentLoaded", () => {
  // updateRocketsUI is typically called on tab switch.
});
