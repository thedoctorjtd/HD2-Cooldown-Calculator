<script lang="ts">
  // Default to 404 if SvelteKit doesn't pass a status in static 404
  export let status: number = 404;
  export let error: unknown;
  const code = status;
  const isNotFound = code === 404;
  const title = isNotFound ? 'You have left the mission area.' : 'A critical error has occurred.';
  const detail = isNotFound ? 'The page you requested could not be located.' : ((error as any)?.message || 'Unexpected error.');
</script>

<section class="error-wrap">
  <div class="error-card">
    <div class="badge">{code}</div>
    <h1>{title}</h1>
    <p class="lede">{detail}</p>
    <p class="quip">
      Your <strong>Democracy Officer</strong> has been notified that you wandered off the objective.
      <span class="subline">Please report to your Super Destroyer immediately.</span>
    </p>
    <div class="actions">
      <a href="/stratagems" class="btn primary">Go to Stratagems</a>
      <a href="/rockets" class="btn">Go to Rockets</a>
    </div>
  </div>
</section>

<svelte:head>
  <title>{code} — {isNotFound ? 'Not Found' : 'Error'} | Helldivers 2 Calculator</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<style>
  .error-wrap {
    min-height: 60vh;
    display: grid;
    place-items: center;
    padding: 2rem 1rem;
  }
  .error-card {
    max-width: 720px;
    background: #2a2a2a;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.35);
  }
  .badge {
    display: inline-block;
    background: #ffc107;
    color: #1a1a1a;
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  h1 { color: #ffc107; margin: 0.25rem 0 0.5rem; }
  .lede { color: #e0e0e0; margin: 0.25rem 0 1rem; }
  .quip { color: #ccc; margin: 0.75rem 0 1.25rem; }
  .quip .subline { display: block; margin-top: 0.6rem; }
  .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
  .btn {
    text-decoration: none;
    display: inline-block;
  }
  .btn { background: #333; color: #ffc107; padding: 0.6rem 1rem; border-radius: 6px; border: 1px solid #555; }
  .btn.primary { background: #ffc107; color: #1a1a1a; border-color: #ffc107; }
  .btn:hover { filter: brightness(1.05); }
</style>
