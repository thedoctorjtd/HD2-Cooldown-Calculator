export async function loadJson(path) {
  // Use fetch when running in a browser environment.
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  }
  // Fallback for Node: read file from disk.
  const fs = await import('node:fs/promises');
  const root = new URL('../..', import.meta.url);
  const url = new URL(path, root);
  const data = await fs.readFile(url, 'utf8');
  return JSON.parse(data);
}

export async function loadAllStratagems() {
  const files = [
    'data/orbitals.json',
    'data/eagles.json',
    'data/supportWeapons.json',
    'data/backpacks.json',
    'data/sentries.json',
    'data/emplacements.json',
    'data/vehicles.json',
    'data/miscellaneous.json',
  ];
  const lists = await Promise.all(files.map(loadJson));
  return lists.flat();
}
