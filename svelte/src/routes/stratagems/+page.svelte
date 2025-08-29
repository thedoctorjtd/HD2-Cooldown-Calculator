<script lang="ts">
  import { onMount } from 'svelte';
  import { loadAllStratagems } from '$lib/utils/dataLoader';
  import {
    selectedUpgrades,
    upgradeEffects,
    setUpgrade,
    stratagemsOptions,
    globalOptions
  } from '$lib/stores';
  import { ALL_UPGRADES } from '$lib/upgrades';
  import {
    calculateCooldown,
    computeUsesForRegular,
    computeUsesForEagle,
    filterStratagems,
    type Stratagem
  } from '$lib/stratagems/calculations';
  import { collapsible } from '$lib/utils/collapsible';

  let stratagems: Stratagem[] = [];
  const CATEGORIES_ORDER = [
    'orbitals',
    'eagles',
    'support weapons',
    'backpacks',
    'sentries',
    'emplacements',
    'vehicles',
    'miscellaneous'
  ];

  onMount(() => {
    // Static import, but keep async in case of future data loading
    stratagems = loadAllStratagems() as Stratagem[];
  });

  function toggleCategory(cat: string) {
    stratagemsOptions.update((s) => ({
      ...s,
      categoryOpenState: {
        ...s.categoryOpenState,
        [cat]: !(s.categoryOpenState?.[cat] ?? false)
      }
    }));
  }

  function isOpen(cat: string, openState: Record<string, boolean>) {
    // default open if not explicitly set
    return openState.hasOwnProperty(cat) ? openState[cat] : true;
  }

  $: if (stratagems.length && $stratagemsOptions.search.trim()) {
    const filtered = filterStratagems(stratagems, $stratagemsOptions.search);
    const visibleCats = CATEGORIES_ORDER.filter((c) =>
      filtered.some((s) => s.category.toLowerCase() === c)
    );
    const allCollapsed =
      visibleCats.length > 0 &&
      visibleCats.every((c) => !isOpen(c, $stratagemsOptions.categoryOpenState));
    const allGloballyCollapsed = CATEGORIES_ORDER.every(
      (c) => !isOpen(c, $stratagemsOptions.categoryOpenState)
    );
    if (allCollapsed && !allGloballyCollapsed) {
      stratagemsOptions.update((s) => ({
        ...s,
        categoryOpenState: {
          ...s.categoryOpenState,
          ...Object.fromEntries(visibleCats.map((c) => [c, true]))
        }
      }));
    }
  }
</script>

<div class="container">
  <div class="mission-config">
    <h2>Mission Configuration</h2>
    <div class="config-row">
      <label>
        <input type="checkbox" bind:checked={$globalOptions.orbitalFluctuations} />
        Orbital Fluctuations (+25% All Cooldowns)
      </label>
    </div>
    <div class="config-row">
      <label>
        <input type="checkbox" bind:checked={$stratagemsOptions.dssPresence} />
        DSS Presence (-50% Exosuit Cooldown)
      </label>
    </div>
  </div>

  <div class="search-bar">
    <input
      type="text"
      placeholder="Search stratagems (by name or category)..."
      bind:value={$stratagemsOptions.search}
    />
  </div>

{#if stratagems.length}
    {#each CATEGORIES_ORDER as cat}
      {#if filterStratagems(stratagems, $stratagemsOptions.search).filter(s => s.category.toLowerCase() === cat).length}
        <section class="category-section">
          <button type="button" class="category-header" onclick={() => toggleCategory(cat)}>
            <span class="capitalize">{cat}</span>
            <span class="category-icon">{isOpen(cat, $stratagemsOptions.categoryOpenState) ? '–' : '+'}</span>
          </button>

          <div class="category-content {isOpen(cat, $stratagemsOptions.categoryOpenState) ? 'open' : ''}"
               use:collapsible={isOpen(cat, $stratagemsOptions.categoryOpenState)}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Cooldown</th>
                    <th>Use Limit</th>
                    <th>Uses / 5 Min</th>
                    <th>Uses / 40 Min</th>
                  </tr>
                </thead>
                <tbody>
                  {#each filterStratagems(stratagems, $stratagemsOptions.search).filter(s => s.category.toLowerCase() === cat) as s}
                    <tr>
                      <td>{s.name}</td>
                      <td>
                        {#if s.type === 'eagle'}
                          <span>
                            Single:
                            {calculateCooldown(s, $upgradeEffects, {
                              orbitalFluctuations: $globalOptions.orbitalFluctuations,
                              dssPresence: $stratagemsOptions.dssPresence
                            })}s,
                            Rearm:
                            {Math.round(
                              s.rearmCd *
                                $upgradeEffects.eagleRearmCooldownMult *
                                ($globalOptions.orbitalFluctuations ? 1.25 : 1)
                            )}s
                          </span>
                          {#if $upgradeEffects.eagleEarlyRearmMult < 1}
                            <span>
                              (
                              Early:
                              {Math.round(
                                Math.round(
                                  s.rearmCd *
                                    $upgradeEffects.eagleRearmCooldownMult *
                                    ($globalOptions.orbitalFluctuations ? 1.25 : 1)
                                ) * $upgradeEffects.eagleEarlyRearmMult
                              )}s)
                            </span>
                          {/if}
                        {:else}
                          {calculateCooldown(s, $upgradeEffects, {
                            orbitalFluctuations: $globalOptions.orbitalFluctuations,
                            dssPresence: $stratagemsOptions.dssPresence
                          })}s
                        {/if}
                      </td>
                      <td>
                        {#if s.type === 'limited' && s.maxUses !== undefined}
                          {s.maxUses}
                        {:else if s.type === 'eagle'}
                          {s.baseUsesPerRearm + $upgradeEffects.eagleUsesPerRearmBonus} / rearm (∞)
                        {:else}
                          Unlimited
                        {/if}
                      </td>
                      <td>
                        {#if s.type === 'eagle'}
                          {computeUsesForEagle(s, $upgradeEffects, { orbitalFluctuations: $globalOptions.orbitalFluctuations, dssPresence: $stratagemsOptions.dssPresence }, 300)}
                        {:else}
                          {computeUsesForRegular(
                            s,
                            calculateCooldown(s, $upgradeEffects, {
                              orbitalFluctuations: $globalOptions.orbitalFluctuations,
                              dssPresence: $stratagemsOptions.dssPresence
                            }),
                            300
                          )}
                        {/if}
                      </td>
                      <td>
                        {#if s.type === 'eagle'}
                          {computeUsesForEagle(s, $upgradeEffects, { orbitalFluctuations: $globalOptions.orbitalFluctuations, dssPresence: $stratagemsOptions.dssPresence }, 2400)}
                        {:else}
                          {computeUsesForRegular(
                            s,
                            calculateCooldown(s, $upgradeEffects, {
                              orbitalFluctuations: $globalOptions.orbitalFluctuations,
                              dssPresence: $stratagemsOptions.dssPresence
                            }),
                            2400
                          )}
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
          </div>
        </section>
      {/if}
    {/each}
{:else}
  <p>Loading stratagems…</p>
{/if}

</div>
