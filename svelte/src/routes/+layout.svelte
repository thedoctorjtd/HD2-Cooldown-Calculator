<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { selectedUpgrades, setUpgrade, stratagemsOptions } from '$lib/stores';
  import { ALL_UPGRADES } from '$lib/upgrades';
  import { collapsible } from '$lib/utils/collapsible';
  
  let upgradesOpen = $state(false); // always start closed on load
  
  const isError = $derived(!!$page.error || (($page.status ?? 200) >= 400) || $page.url.pathname === '/404');
  const currentPage = $derived($page.url.pathname.startsWith('/rockets') ? 'rockets' : 'stratagems');
  const visibleUpgrades = $derived(ALL_UPGRADES.filter((u) => u.pages.includes(currentPage)));
  const upgradeCategories = $derived(Array.from(new Set(visibleUpgrades.map((u) => u.category))));

  let { children } = $props();

  onMount(() => {
    const el = document.getElementById('footer');
    if (el) el.style.visibility = 'visible';
  });
</script>

<svelte:head>
  <link rel="icon" href="/images/favicon.png" />
  <title>Helldivers 2 Stratagem & Rockets Calculator</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

{#if !isError}
  <header>
    <h1>Helldivers 2 Stratagem & Rockets Calculator</h1>
    <div class="tabs">
      {#if $page.url.pathname.startsWith('/stratagems') || $page.url.pathname === '/'}
        <a class="tab active" href="/stratagems">Stratagems</a>
        <a class="tab" href="/rockets">Rockets</a>
      {:else}
        <a class="tab" href="/stratagems">Stratagems</a>
        <a class="tab active" href="/rockets">Rockets</a>
      {/if}
    </div>
  </header>
{/if}

{#if !isError}
  <!-- Global Ship Upgrades Accordion -->
  <div class="accordion-section">
    <button
      type="button"
      class="accordion-header"
      class:active={upgradesOpen}
      onclick={() => (upgradesOpen = !upgradesOpen)}
    >
      <h2>Select Your Ship Upgrades</h2>
      <span class="accordion-icon"></span>
    </button>
    <div
      class="accordion-content { upgradesOpen ? 'open' : '' } container"
      use:collapsible={upgradesOpen}
    >
      {#each upgradeCategories as group}
        <div class="upgrade-category">
          <h3>{group}</h3>
          <div>
            {#each visibleUpgrades.filter(u => u.category === group) as upg}
              <label class="upgrade-row">
                <input
                  type="checkbox"
                  checked={$selectedUpgrades.includes(upg.id)}
                  onchange={(e) => setUpgrade(upg.id, e.currentTarget.checked)}
                />
                <span><span>{upg.shortName}</span> <span class="upgrade-desc">({upg.description})</span></span>
              </label>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<main>
  {@render children?.()}
</main>

<footer id="footer" class:hidden-until-loaded={!isError}>
  <p>
    Made by <strong>theDoctor</strong> |
    <a href="https://github.com/thedoctorjtd/HD2-Cooldown-Calculator" target="_blank">GitHub</a>
  </p>
  <p>
    Helldivers™ is a trademark of Arrowhead Game Studios. This app is fan-made and unofficial.
  </p>
</footer>
