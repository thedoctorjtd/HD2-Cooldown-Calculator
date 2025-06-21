import { getUpgradeEffects } from "./upgrades.js";

// Preferred category ordering when rendering tables
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

export function isOrbitalFluctuationsActive() {
  return document.getElementById("orbitalFluctuationsCheckbox").checked;
}

export function isDssPresenceActive() {
  const cb = document.getElementById("dssPresenceCheckbox");
  return cb ? cb.checked : false;
}

export function calculateCooldown(stratagem, effects) {
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

export function computeUsesForRegular(stratagem, finalCooldown, totalTime) {
  if (finalCooldown <= 0) return 0;
  let uses = 1 + Math.floor(totalTime / finalCooldown);
  if (stratagem.type === "limited" && stratagem.maxUses !== undefined) {
    uses = Math.min(uses, stratagem.maxUses);
  }
  return uses;
}

export function computeUsesForEagle(stratagem, effects, totalTime) {
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

export function renderTables(stratagems, selectedUpgrades) {
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

    const isOpen =
      window.categoryOpenState.hasOwnProperty(cat)
        ? window.categoryOpenState[cat]
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
      window.categoryOpenState[cat] = opened;
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

export function filterStratagems(stratagems, filterText) {
  if (!filterText) return stratagems;
  const search = filterText.toLowerCase();
  return stratagems.filter(
    (s) =>
      s.name.toLowerCase().includes(search) ||
      s.category.toLowerCase().includes(search)
  );
}

