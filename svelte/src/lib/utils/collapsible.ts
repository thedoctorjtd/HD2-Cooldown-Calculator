// Svelte action to smoothly open/close a collapsible section by animating max-height
// Usage: <div use:collapsible={expanded}> ... </div>
export function collapsible(node: HTMLElement, expanded: boolean) {
  let isOpen = expanded;
  let animating = false;

  const setHeight = (h: number) => {
    node.style.maxHeight = `${h}px`;
  };

  const measure = () => node.scrollHeight || 0;

  // Ensure transition styles are present
  node.style.overflow = 'hidden';

  // Track when a user-triggered expand/collapse animation is running
  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.target === node && e.propertyName === 'max-height') {
      animating = false;
    }
  };
  node.addEventListener('transitionend', onTransitionEnd);

  // Watch for content size changes so open sections can grow/shrink
  // Throttle to rAF and avoid fighting the explicit open/close animation
  let rafPending = false;
  const ro = new ResizeObserver(() => {
    if (!isOpen || animating) return;
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      // Temporarily disable transition to avoid choppy multi-step animations
      const prevTransition = node.style.transition;
      node.style.transition = 'none';
      setHeight(measure());
      // Force reflow
      node.getBoundingClientRect();
      // Restore transition so explicit open/close remains smooth
      node.style.transition = prevTransition;
    });
  });
  ro.observe(node);

  // Initial state
  setHeight(isOpen ? measure() : 0);

  function update(next: boolean) {
    if (next === isOpen) return;
    isOpen = next;
    if (isOpen) {
      // open: from current (0) to measured
      animating = true;
      setHeight(0);
      requestAnimationFrame(() => setHeight(measure()));
    } else {
      // close: set to current measured height, then to 0
      animating = true;
      setHeight(measure());
      requestAnimationFrame(() => setHeight(0));
    }
  }

  return {
    update,
    destroy() {
      ro.disconnect();
      node.removeEventListener('transitionend', onTransitionEnd);
    }
  };
}
