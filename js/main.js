// main.js

import { STRATAGEMS } from "./data/allStratagems.js";
import { getUpgradeEffects, enforceUpgradeProgressions } from "./upgrades.js";

/*********************************************************
 * 1. DOM & EVENT SETUP
 *********************************************************/

// Toggle the accordion
const upgradeAccordionHeader = document.getElementById(
  "upgradeAccordionHeader"
);
const upgradeAccordionContent = document.getElementById(
  "upgradeAccordionContent"
);
upgradeAccordionHeader.addEventListener("click", () => {
  if (upgradeAccordionContent.classList.contains("open")) {
    upgradeAccordionContent.classList.remove("open");
    upgradeAccordionContent.style.maxHeight = 0;
    upgradeAccordionHeader.classList.remove("active");
  } else {
    upgradeAccordionContent.classList.add("open");
    upgradeAccordionContent.style.maxHeight =
      upgradeAccordionContent.scrollHeight + "px";
    upgradeAccordionHeader.classList.add("active");
  }
});

// On checkbox change, re-render & save
document.addEventListener("change", function (e) {
  if (e.target.matches('input[type="checkbox"][data-upgrade-id]')) {
    let upgradeId = e.target.getAttribute("data-upgrade-id");
    let isChecked = e.target.checked;

    // Enforce linear progression
    enforceUpgradeProgressions(upgradeId, isChecked);

    // Re-render
    updateUI();

    // Save
    saveSelectedUpgrades();
  } else if (e.target.matches('input[type="checkbox"]')) {
    updateUI();
  }
});

// Search bar listener
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  updateUI();
});

// On load
window.addEventListener("DOMContentLoaded", () => {
  // Load from localStorage
  loadSelectedUpgrades();
  // Fix progression states
  let checkboxes = document.querySelectorAll(
    'input[type="checkbox"][data-upgrade-id]'
  );
  checkboxes.forEach((cb) => {
    enforceUpgradeProgressions(cb.getAttribute("data-upgrade-id"), cb.checked);
  });

  // Initial render
  updateUI();
});

/*********************************************************
 * 2. LOCAL STORAGE & UPGRADE SELECTION
 *********************************************************/
function getSelectedUpgrades() {
  let checkboxes = document.querySelectorAll(
    'input[type="checkbox"][data-upgrade-id]'
  );
  let selected = [];
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      selected.push(cb.getAttribute("data-upgrade-id"));
    }
  });
  return selected;
}

function saveSelectedUpgrades() {
  let selected = getSelectedUpgrades();
  localStorage.setItem("selectedUpgrades", JSON.stringify(selected));
}

function loadSelectedUpgrades() {
  let saved = localStorage.getItem("selectedUpgrades");
  if (!saved) return;
  let selected = JSON.parse(saved);
  let checkboxes = document.querySelectorAll(
    'input[type="checkbox"][data-upgrade-id]'
  );
  checkboxes.forEach((cb) => {
    let id = cb.getAttribute("data-upgrade-id");
    cb.checked = selected.includes(id);
  });
}

/*********************************************************
 * 3. CALCULATION & RENDERING
 *********************************************************/

// Category display order
const CATEGORIES_ORDER = [
  "orbitals",
  "eagles",
  "support weapons",
  "backpacks",
  "sentries",
  "emplacements",
  "vehicles",
  "miscellaneous",
];

// Check if Orbital Fluctuations is active
function isOrbitalFluctuationsActive() {
  return document.getElementById("orbitalFluctuationsCheckbox").checked;
}

// Calculate final (single) cooldown for unlimited/limited types
function calculateCooldown(stratagem, effects) {
  if (stratagem.type === "eagle") {
    let cd = stratagem.singleUseCd;
    cd *= effects.universalCooldownMult;
    cd *= effects.eagleUseCooldownMult;
    if (isOrbitalFluctuationsActive()) {
      cd *= 1.25;
    }
    return Math.round(cd);
  } else {
    let cd = stratagem.baseCooldown || 0;
    cd *= effects.universalCooldownMult;

    let cat = (stratagem.category || "").toLowerCase();
    if (cat === "support weapons") {
      cd *= effects.supportWeaponCooldownMult;
    } else if (cat === "backpacks") {
      cd *= effects.backpackCooldownMult;
    } else if (cat === "orbitals") {
      cd *= effects.orbitalCooldownMult;
    } else if (["sentries", "emplacements", "miscellaneous"].includes(cat)) {
      cd *= effects.sentryEmplacementResupplyCooldownMult;
    }

    if (isOrbitalFluctuationsActive()) {
      cd *= 1.25;
    }

    return Math.round(cd);
  }
}

// For standard unlimited/limited
function computeUsesForRegular(stratagem, finalCooldown, T) {
  if (finalCooldown <= 0) return 0;

  // 1 usage at t=0, subsequent uses every finalCooldown
  let uses = 1 + Math.floor(T / finalCooldown);

  if (stratagem.type === "limited" && stratagem.maxUses !== undefined) {
    uses = Math.min(uses, stratagem.maxUses);
  }
  return uses;
}

// For eagles
function computeUsesForEagle(stratagem, effects, T) {
  let singleCd = calculateCooldown(stratagem, effects);
  let baseRearmCd = stratagem.rearmCd * effects.eagleRearmCooldownMult;
  if (isOrbitalFluctuationsActive()) {
    baseRearmCd *= 1.25;
  }
  baseRearmCd = Math.round(baseRearmCd);

  let usesPerRearm =
    stratagem.baseUsesPerRearm + effects.eagleUsesPerRearmBonus;
  let time = 0;
  let totalUses = 0;

  while (true) {
    // Use up 'usesPerRearm' times
    for (let i = 0; i < usesPerRearm; i++) {
      if (time > T) return totalUses;
      totalUses++;
      time += singleCd;
    }
    if (time > T) return totalUses;

    // Now re-arm
    time += baseRearmCd;
  }
}

function renderTables(stratagems, selectedUpgrades) {
  const container = document.getElementById("stratagemTablesContainer");
  container.innerHTML = "";

  const effects = getUpgradeEffects(selectedUpgrades);

  CATEGORIES_ORDER.forEach((cat) => {
    let catItems = stratagems.filter((s) => s.category.toLowerCase() === cat);
    if (catItems.length === 0) return; // skip empty

    // Wrapper div for everything
    let section = document.createElement("div");
    section.classList.add("category-section");

    // HEADER (clickable to collapse)
    let header = document.createElement("div");
    header.classList.add("category-header");
    header.textContent = cat;

    // ICON or symbol to show expand/collapse
    let iconSpan = document.createElement("span");
    iconSpan.classList.add("category-icon");
    iconSpan.textContent = "–";
    header.appendChild(iconSpan);

    // CONTENT (the actual table)
    let content = document.createElement("div");
    content.classList.add("category-content", "open");
    // "open" means it's expanded by default

    // Build the table
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    ["Name", "Cooldown", "Use Limit", "Uses / 5 Min", "Uses / 40 Min"].forEach(
      (col) => {
        let th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      }
    );
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    catItems.forEach((strat) => {
      let row = document.createElement("tr");

      // name
      let nameTd = document.createElement("td");
      nameTd.textContent = strat.name;
      row.appendChild(nameTd);

      // cooldown
      let cdTd = document.createElement("td");
      if (strat.type === "eagle") {
        let singleCd = calculateCooldown(strat, effects);
        let baseRearmCd = strat.rearmCd * effects.eagleRearmCooldownMult;
        if (isOrbitalFluctuationsActive()) {
          baseRearmCd *= 1.25;
        }
        baseRearmCd = Math.round(baseRearmCd);
        let earlyRearmCd = Math.round(
          baseRearmCd * effects.eagleEarlyRearmMult
        );
        let text = `Single: ${singleCd}s, Rearm: ${baseRearmCd}s`;
        if (effects.eagleEarlyRearmMult < 1) {
          text += ` (Early: ${earlyRearmCd}s)`;
        }
        cdTd.textContent = text;
      } else {
        let finalCd = calculateCooldown(strat, effects);
        cdTd.textContent = finalCd + "s";
      }
      row.appendChild(cdTd);

      // use limit
      let limitTd = document.createElement("td");
      if (strat.type === "limited" && strat.maxUses !== undefined) {
        limitTd.textContent = strat.maxUses;
      } else if (strat.type === "eagle") {
        let usesPerRearm =
          strat.baseUsesPerRearm + effects.eagleUsesPerRearmBonus;
        limitTd.textContent = `${usesPerRearm} / rearm (∞)`;
      } else {
        limitTd.textContent = "Unlimited";
      }
      row.appendChild(limitTd);

      // uses / 5 min
      let uses5Td = document.createElement("td");
      if (strat.type === "eagle") {
        uses5Td.textContent = computeUsesForEagle(strat, effects, 300);
      } else {
        let finalCd = calculateCooldown(strat, effects);
        uses5Td.textContent = computeUsesForRegular(strat, finalCd, 300);
      }
      row.appendChild(uses5Td);

      // uses / 40 min
      let uses40Td = document.createElement("td");
      if (strat.type === "eagle") {
        uses40Td.textContent = computeUsesForEagle(strat, effects, 2400);
      } else {
        let finalCd = calculateCooldown(strat, effects);
        uses40Td.textContent = computeUsesForRegular(strat, finalCd, 2400);
      }
      row.appendChild(uses40Td);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    content.appendChild(table);

    // Put header + content in the section
    section.appendChild(header);
    section.appendChild(content);

    // Add the section to container
    container.appendChild(section);

    // Setup click on header to toggle
    header.addEventListener("click", () => {
      // Toggle "open" class on content
      content.classList.toggle("open");
      // Toggle icon
      if (content.classList.contains("open")) {
        iconSpan.textContent = "–";
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        iconSpan.textContent = "+";
        content.style.maxHeight = 0;
      }
    });

    // Make sure it’s expanded by default
    content.style.maxHeight = content.scrollHeight + "px";
  });
}

function filterStratagems(stratagems, filterText) {
  if (!filterText) return stratagems;
  let search = filterText.toLowerCase();
  return stratagems.filter(
    (s) =>
      s.name.toLowerCase().includes(search) ||
      s.category.toLowerCase().includes(search)
  );
}

function updateUI() {
  let selectedUpgrades = getSelectedUpgrades();
  let filtered = filterStratagems(STRATAGEMS, searchInput.value);
  renderTables(filtered, selectedUpgrades);
}
