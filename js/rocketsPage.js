import { loadJson } from "./utils/dataLoader.js";
import { getUpgradeEffects } from "./upgrades.js";
import {
  computeExpendableShots,
  computeBackpackShots,
  computeEnergyShots,
} from "./rocketsCalculations.js";

export const ROCKETS = await loadJson('data/rockets.json');

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

  const calcOptions = {
    effects,
    complexPlotting,
    orbitalFluctuations,
    planetWeather,
    resupplyCount,
  };

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
      shots5 = computeExpendableShots(weapon, T5, calcOptions);
      shots40 = computeExpendableShots(weapon, T40, calcOptions);
    } else if (weapon.type === "Backpack") {
      shots5 = computeBackpackShots(weapon, T5, calcOptions);
      shots40 = computeBackpackShots(weapon, T40, calcOptions);
    } else if (weapon.type === "Energy") {
      shots5 = computeEnergyShots(weapon, T5, calcOptions);
      shots40 = computeEnergyShots(weapon, T40, calcOptions);
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
