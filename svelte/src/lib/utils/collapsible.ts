// Svelte action to smoothly open/close a collapsible section by animating max-height
// Usage: <div use:collapsible={expanded}> ... </div>
export function collapsible(node: HTMLElement, expanded: boolean) {
  let isOpen = expanded;

  const setHeight = (h: number) => {
    node.style.maxHeight = `${h}px`;
  };

  const measure = () => node.scrollHeight || 0;

  // Ensure transition styles are present
  node.style.overflow = 'hidden';

  // Initial state
  setHeight(isOpen ? measure() : 0);

  function update(next: boolean) {
    if (next === isOpen) return;
    isOpen = next;
    if (isOpen) {
      // open: from current (0) to measured
      setHeight(0);
      requestAnimationFrame(() => setHeight(measure()));
    } else {
      // close: set to current measured height, then to 0
      setHeight(measure());
      requestAnimationFrame(() => setHeight(0));
    }
  }

  return { update };
}

