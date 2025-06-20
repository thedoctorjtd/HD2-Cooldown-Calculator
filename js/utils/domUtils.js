export function openAccordion(headerEl, contentEl) {
  headerEl.classList.add("active");
  contentEl.classList.add("open");
  contentEl.style.maxHeight = contentEl.scrollHeight + "px";
}

export function closeAccordion(headerEl, contentEl) {
  headerEl.classList.remove("active");
  contentEl.classList.remove("open");
  contentEl.style.maxHeight = 0;
}
