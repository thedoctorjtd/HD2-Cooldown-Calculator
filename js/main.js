import { STRATAGEMS } from "./data/allStratagems.js";
import { getUpgradeEffects, enforceUpgradeProgressions } from "./upgrades.js";
import { ALL_UPGRADES } from "./upgradesData.js";
import { updateRocketsUI } from "./rocketsPage.js";
import { openAccordion, closeAccordion } from "./utils/domUtils.js";
import {
  loadSelectedUpgrades,
  saveSelectedUpgrades,
  getSelectedUpgrades,
} from "./utils/storage.js";

/*********************************************************
 * GLOBAL STATE & DOM SELECTORS
 *********************************************************/
export const uiState = {
  shipUpgradesAccordionOpen: false,
  categoryOpenState: {},
};
// Tab elements and page containers
const tabStratagems = document.getElementById("tabStratagems");
const tabRockets = document.getElementById("tabRockets");
const stratagemPage = document.getElementById("stratagemPage");
const rocketsPage = document.getElementById("rocketsPage");

// Global Ship Upgrades Accordion elements
const globalAccordionHeader = document.getElementById(
  "globalUpgradesAccordionHeader"
);
const globalAccordionContent = document.getElementById(
  "globalShipUpgradesContainer"
);

/*********************************************************
 * ACCORDION OPEN/CLOSE HELPERS
 *********************************************************/

// Toggle accordion on header click.
globalAccordionHeader.addEventListener("click", () => {
  if (globalAccordionContent.classList.contains("open")) {
    closeAccordion(globalAccordionHeader, globalAccordionContent);
    uiState.shipUpgradesAccordionOpen = false;
  } else {
    openAccordion(globalAccordionHeader, globalAccordionContent);
    uiState.shipUpgradesAccordionOpen = true;
  }
});

/*********************************************************
 * RENDER GLOBAL UPGRADES
 *********************************************************/
function renderAllUpgrades() {
  const container = document.getElementById("globalShipUpgradesContainer");
  container.innerHTML = "";

  // Define categories in desired order.
  const categoriesInOrder = [
    "Patriotic Administration Center",
    "Orbital Cannons",
    "Hangar",
    "Bridge",
    "Engineering Bay",
  ];

  categoriesInOrder.forEach((catName) => {
    const catUpgrades = ALL_UPGRADES.filter((u) => u.category === catName);
    if (!catUpgrades.length) return;

    const catDiv = document.createElement("div");
    catDiv.classList.add("upgrade-category");

    const h3 = document.createElement("h3");
    h3.textContent = catName;
    catDiv.appendChild(h3);

    catUpgrades.forEach((upgrade) => {
      const row = document.createElement("div");
      row.classList.add("upgrade-row");
      // Store applicable pages for filtering.
      row.setAttribute("data-pages", upgrade.pages.join(","));

      const label = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.setAttribute("data-upgrade-id", upgrade.id);
      label.appendChild(cb);
      label.appendChild(
        document.createTextNode(
          ` ${upgrade.shortName} (${upgrade.description})`
        )
      );
      row.appendChild(label);
      catDiv.appendChild(row);
    });

    container.appendChild(catDiv);
  });
}

/*********************************************************
 * UPGRADES VISIBILITY BASED ON ACTIVE TAB
 *********************************************************/
function refreshUpgradesVisibility(activeTab) {
  const container = document.getElementById("globalShipUpgradesContainer");
  const categoryDivs = container.querySelectorAll(".upgrade-category");
  categoryDivs.forEach((catDiv) => {
    let hasVisible = false;
    const rows = catDiv.querySelectorAll(".upgrade-row");
    rows.forEach((row) => {
      const pagesArr = row.getAttribute("data-pages").split(",");
      if (pagesArr.includes(activeTab)) {
        row.style.display = "";
        hasVisible = true;
      } else {
        row.style.display = "none";
      }
    });
    // Hide the entire category if no rows are visible
    catDiv.style.display = hasVisible ? "" : "none";
  });
}

/*********************************************************
 * SHIP MODULE PROGRESSION ENFORCEMENT
 *********************************************************/

function enforceProgressionOnAllCheckboxes() {
  document.querySelectorAll("input[data-upgrade-id]").forEach((cb) => {
    enforceUpgradeProgressions(cb.getAttribute("data-upgrade-id"), cb.checked);
  });
}

/*********************************************************
 * STRATAGEMS TABLE RENDERING
 *********************************************************/
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

function isOrbitalFluctuationsActive() {
  return document.getElementById("orbitalFluctuationsCheckbox").checked;
}

function isDssPresenceActive() {
  const cb = document.getElementById("dssPresenceCheckbox");
  return cb ? cb.checked : false;
}

function calculateCooldown(stratagem, effects) {
  if (stratagem.type === "eagle") {
    let cd =
      stratagem.singleUseCd *
      effects.universalCooldownMult *
      effects.eagleUseCooldownMult;
    if (isOrbitalFluctuationsActive()) cd *= 1.25;
    return Math.round(cd);
  } else {
    let cd = (stratagem.baseCooldown || 0) * effects.universalCooldownMult;
    const cat = (stratagem.category || "").toLowerCase();
    if (cat === "support weapons") {
      cd *= effects.supportWeaponCooldownMult;
    } else if (cat === "backpacks") {
      cd *= effects.backpackCooldownMult;
    } else if (cat === "orbitals") {
      cd *= effects.orbitalCooldownMult;
    } else if (["sentries", "emplacements", "miscellaneous"].includes(cat)) {
      cd *= effects.sentryEmplacementResupplyCooldownMult;
    }
    if (
      isDssPresenceActive() &&
      cat === "vehicles" &&
      stratagem.name.toLowerCase().includes("exosuit")
    ) {
      cd *= 0.5;
    }
    if (isOrbitalFluctuationsActive()) cd *= 1.25;
    return Math.round(cd);
  }
}

function computeUsesForRegular(stratagem, finalCooldown, totalTime) {
  if (finalCooldown <= 0) return 0;
  let uses = 1 + Math.floor(totalTime / finalCooldown);
  if (stratagem.type === "limited" && stratagem.maxUses !== undefined) {
    uses = Math.min(uses, stratagem.maxUses);
  }
  return uses;
}

function computeUsesForEagle(stratagem, effects, totalTime) {
  const singleCd = calculateCooldown(stratagem, effects);
  let baseRearmCd = Math.round(
    stratagem.rearmCd *
      effects.eagleRearmCooldownMult *
      (isOrbitalFluctuationsActive() ? 1.25 : 1)
  );
  const usesPerRearm =
    stratagem.baseUsesPerRearm + effects.eagleUsesPerRearmBonus;
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

function renderTables(stratagems, selectedUpgrades) {
  const container = document.getElementById("stratagemTablesContainer");
  container.innerHTML = "";
  const effects = getUpgradeEffects(selectedUpgrades);

  CATEGORIES_ORDER.forEach((cat) => {
    const catItems = stratagems.filter((s) => s.category.toLowerCase() === cat);
    if (!catItems.length) return;

    const section = document.createElement("div");
    section.classList.add("category-section");

    const header = document.createElement("div");
    header.classList.add("category-header");
    header.textContent = cat;

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("category-icon");
    iconSpan.textContent = "–";
    header.appendChild(iconSpan);

    const isOpen = uiState.categoryOpenState.hasOwnProperty(cat)
      ? uiState.categoryOpenState[cat]
      : true;

    const content = document.createElement("div");
    content.classList.add("category-content");
    if (isOpen) content.classList.add("open");

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Name", "Cooldown", "Use Limit", "Uses / 5 Min", "Uses / 40 Min"].forEach(
      (col) => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      }
    );
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    catItems.forEach((strat) => {
      const row = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = strat.name;
      row.appendChild(nameTd);

      const cdTd = document.createElement("td");
      if (strat.type === "eagle") {
        const singleCd = calculateCooldown(strat, effects);
        let baseRearmCd = Math.round(
          strat.rearmCd *
            effects.eagleRearmCooldownMult *
            (isOrbitalFluctuationsActive() ? 1.25 : 1)
        );
        const earlyRearmCd = Math.round(
          baseRearmCd * effects.eagleEarlyRearmMult
        );
        let text = `Single: ${singleCd}s, Rearm: ${baseRearmCd}s`;
        if (effects.eagleEarlyRearmMult < 1) {
          text += ` (Early: ${earlyRearmCd}s)`;
        }
        cdTd.textContent = text;
      } else {
        cdTd.textContent = `${calculateCooldown(strat, effects)}s`;
      }
      row.appendChild(cdTd);

      const limitTd = document.createElement("td");
      if (strat.type === "limited" && strat.maxUses !== undefined) {
        limitTd.textContent = strat.maxUses;
      } else if (strat.type === "eagle") {
        const usesPerRearm =
          strat.baseUsesPerRearm + effects.eagleUsesPerRearmBonus;
        limitTd.textContent = `${usesPerRearm} / rearm (∞)`;
      } else {
        limitTd.textContent = "Unlimited";
      }
      row.appendChild(limitTd);

      const uses5Td = document.createElement("td");
      if (strat.type === "eagle") {
        uses5Td.textContent = computeUsesForEagle(strat, effects, 300);
      } else {
        uses5Td.textContent = computeUsesForRegular(
          strat,
          calculateCooldown(strat, effects),
          300
        );
      }
      row.appendChild(uses5Td);

      const uses40Td = document.createElement("td");
      if (strat.type === "eagle") {
        uses40Td.textContent = computeUsesForEagle(strat, effects, 2400);
      } else {
        uses40Td.textContent = computeUsesForRegular(
          strat,
          calculateCooldown(strat, effects),
          2400
        );
      }
      row.appendChild(uses40Td);

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    content.appendChild(table);
    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);

    // Collapsible category table logic.
    header.addEventListener("click", () => {
      content.classList.toggle("open");
      const opened = content.classList.contains("open");
      uiState.categoryOpenState[cat] = opened;
      if (opened) {
        iconSpan.textContent = "–";
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        iconSpan.textContent = "+";
        content.style.maxHeight = 0;
      }
    });
    if (isOpen) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      iconSpan.textContent = "+";
      content.style.maxHeight = 0;
    }
  });
}

function filterStratagems(stratagems, filterText) {
  if (!filterText) return stratagems;
  const search = filterText.toLowerCase();
  return stratagems.filter(
    (s) =>
      s.name.toLowerCase().includes(search) ||
      s.category.toLowerCase().includes(search)
  );
}

/*********************************************************
 * UI UPDATE FUNCTION
 *********************************************************/
function updateUI() {
  const selectedUpgrades = getSelectedUpgrades();
  const searchText = document.getElementById("searchInput").value;
  const filteredStratagems = filterStratagems(STRATAGEMS, searchText);
  updateRocketsUI();
  renderTables(filteredStratagems, selectedUpgrades);
}

/*********************************************************
 * EVENT LISTENERS
 *********************************************************/
// Combined change event listener for all checkboxes and dropdowns.
document.addEventListener("change", (e) => {
  if (e.target.matches('input[type="checkbox"][data-upgrade-id]')) {
    enforceUpgradeProgressions(
      e.target.getAttribute("data-upgrade-id"),
      e.target.checked
    );
    saveSelectedUpgrades();
    updateUI();
  } else if (e.target.matches('input[type="checkbox"]')) {
    updateUI();
  } else if (e.target.matches("select")) {
    // Handle dropdown changes (e.g., planet weather, resupply count)
    updateRocketsUI();
  }
});

/*********************************************************
 * TAB SWITCHING LOGIC
 *********************************************************/
tabStratagems.addEventListener("click", () => {
  stratagemPage.style.display = "block";
  rocketsPage.style.display = "none";

  tabStratagems.classList.add("active");
  tabRockets.classList.remove("active");

  loadSelectedUpgrades();
  enforceProgressionOnAllCheckboxes();
  refreshUpgradesVisibility("stratagems");

  // Reset category accordion state so all categories start expanded
  uiState.categoryOpenState = {};

  if (uiState.shipUpgradesAccordionOpen) {
    openAccordion(globalAccordionHeader, globalAccordionContent);
  } else {
    closeAccordion(globalAccordionHeader, globalAccordionContent);
  }
  updateUI();
});

tabRockets.addEventListener("click", () => {
  stratagemPage.style.display = "none";
  rocketsPage.style.display = "block";

  tabStratagems.classList.remove("active");
  tabRockets.classList.add("active");

  loadSelectedUpgrades();
  enforceProgressionOnAllCheckboxes();
  refreshUpgradesVisibility("rockets");

  if (uiState.shipUpgradesAccordionOpen) {
    openAccordion(globalAccordionHeader, globalAccordionContent);
  } else {
    closeAccordion(globalAccordionHeader, globalAccordionContent);
  }
  updateRocketsUI();
});

/*********************************************************
 * INITIALIZATION
 *********************************************************/
window.addEventListener("DOMContentLoaded", () => {
  renderAllUpgrades();
  loadSelectedUpgrades();
  enforceProgressionOnAllCheckboxes();
  refreshUpgradesVisibility("stratagems");
  uiState.categoryOpenState = {}; // Default all stratagem categories open
  closeAccordion(globalAccordionHeader, globalAccordionContent);
  uiState.shipUpgradesAccordionOpen = false;
  document.getElementById("searchInput").addEventListener("input", updateUI);
  updateUI();
});
