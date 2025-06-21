import { loadAllStratagems } from "./utils/dataLoader.js";
import { enforceUpgradeProgressions } from "./upgrades.js";
import { ALL_UPGRADES } from "./upgradesData.js";
import { updateRocketsUI } from "./rocketsPage.js";
import { openAccordion, closeAccordion } from "./utils/domUtils.js";
import { renderTables, filterStratagems } from "./stratagemsPage.js";
import {
  loadSelectedUpgrades,
  saveSelectedUpgrades,
  getSelectedUpgrades,
} from "./utils/storage.js";

const STRATAGEMS = await loadAllStratagems();

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
 * UI UPDATE FUNCTION
 *********************************************************/
function updateUI() {
  const selectedUpgrades = getSelectedUpgrades();
  const searchText = document.getElementById("searchInput").value;
  const filteredStratagems = filterStratagems(STRATAGEMS, searchText);
  updateRocketsUI();
  renderTables(filteredStratagems, selectedUpgrades, uiState);
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
window.addEventListener("DOMContentLoaded", async () => {
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
