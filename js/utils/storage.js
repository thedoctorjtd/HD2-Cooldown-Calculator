// Utilities for persisting selected upgrades
// via localStorage.

export function loadSelectedUpgrades() {
  const saved = localStorage.getItem("selectedUpgrades");
  if (!saved) return;
  const selected = JSON.parse(saved);
  document
    .querySelectorAll('input[type="checkbox"][data-upgrade-id]')
    .forEach((cb) => {
      const id = cb.getAttribute("data-upgrade-id");
      cb.checked = selected.includes(id);
    });
}

export function saveSelectedUpgrades() {
  const selected = [];
  document
    .querySelectorAll('input[type="checkbox"][data-upgrade-id]')
    .forEach((cb) => {
      if (cb.checked) {
        selected.push(cb.getAttribute("data-upgrade-id"));
      }
    });
  localStorage.setItem("selectedUpgrades", JSON.stringify(selected));
}

export function getSelectedUpgrades() {
  const selected = [];
  document
    .querySelectorAll('input[type="checkbox"][data-upgrade-id]')
    .forEach((cb) => {
      if (cb.checked) {
        selected.push(cb.getAttribute("data-upgrade-id"));
      }
    });
  return selected;
}

