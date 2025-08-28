<script lang="ts">
  import { onMount } from 'svelte';
  import { loadAllStratagems } from '$lib/utils/dataLoader';
  import {
    selectedUpgrades,
    upgradeEffects,
    setUpgrade,
    stratagemsOptions
  } from '$lib/stores';
  import { ALL_UPGRADES } from '$lib/upgrades';
  import {
    calculateCooldown,
    computeUsesForRegular,
    computeUsesForEagle,
    filterStratagems,
    type Stratagem
  } from '$lib/stratagems/calculations';

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
        [cat]: !(s.categoryOpenState?.[cat] ?? true)
      }
    }));
  }

  function isOpen(cat: string, openState: Record<string, boolean>) {
    return openState.hasOwnProperty(cat) ? openState[cat] : true;
  }
</script>

<h1 class="text-xl font-semibold mb-4">Stratagems</h1>

<section class="mb-6 grid gap-4 md:grid-cols-3">
  <div class="md:col-span-2 flex items-center gap-2">
    <input
      type="text"
      placeholder="Search by name or category..."
      class="w-full rounded border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 px-3 py-2"
      bind:value={$stratagemsOptions.search}
    />
  </div>
  <div class="flex items-center gap-4 justify-end">
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" bind:checked={$stratagemsOptions.orbitalFluctuations} />
      Orbital fluctuations
    </label>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" bind:checked={$stratagemsOptions.dssPresence} />
      DSS presence (Exosuit -50%)
    </label>
  </div>
  <div class="md:col-span-3">
    <h2 class="font-medium mb-2">Upgrades</h2>
    <div class="grid md:grid-cols-3 gap-3">
      {#each Array.from(new Set(ALL_UPGRADES.map(u => u.category))) as group}
        <div class="rounded border border-gray-200 dark:border-gray-800 p-3">
          <h3 class="text-sm font-semibold mb-2">{group}</h3>
          <div class="space-y-2">
            {#each ALL_UPGRADES.filter(u => u.category === group) as upg}
              <label class="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={$selectedUpgrades.includes(upg.id)}
                  on:change={(e) => setUpgrade(upg.id, e.currentTarget.checked)}
                />
                <span>
                  <span class="font-medium">{upg.shortName}</span>
                  <span class="block text-gray-600 dark:text-gray-400">{upg.description}</span>
                </span>
              </label>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

{#if stratagems.length}
  {#key $stratagemsOptions}
    {#each CATEGORIES_ORDER as cat}
      {#if filterStratagems(stratagems, $stratagemsOptions.search).filter(s => s.category.toLowerCase() === cat).length}
        <section class="mb-6">
          <button
            class="w-full flex items-center justify-between text-left py-2 px-3 rounded bg-gray-100 dark:bg-gray-800"
            on:click={() => toggleCategory(cat)}
          >
            <span class="capitalize">{cat}</span>
            <span class="text-xl">{isOpen(cat, $stratagemsOptions.categoryOpenState) ? '–' : '+'}</span>
          </button>

          {#if isOpen(cat, $stratagemsOptions.categoryOpenState)}
            <div class="overflow-x-auto">
              <table class="min-w-full mt-2 text-sm">
                <thead class="text-left text-gray-600 dark:text-gray-300">
                  <tr>
                    <th class="py-1 px-2">Name</th>
                    <th class="py-1 px-2">Cooldown</th>
                    <th class="py-1 px-2">Use Limit</th>
                    <th class="py-1 px-2">Uses / 5 Min</th>
                    <th class="py-1 px-2">Uses / 40 Min</th>
                  </tr>
                </thead>
                <tbody>
                  {#each filterStratagems(stratagems, $stratagemsOptions.search).filter(s => s.category.toLowerCase() === cat) as s}
                    <tr class="border-t border-gray-200 dark:border-gray-800">
                      <td class="py-1 px-2">{s.name}</td>
                      <td class="py-1 px-2">
                        {#if s.type === 'eagle'}
                          <span>
                            Single:
                            {calculateCooldown(s, $upgradeEffects, {
                              orbitalFluctuations: $stratagemsOptions.orbitalFluctuations,
                              dssPresence: $stratagemsOptions.dssPresence
                            })}s,
                            Rearm:
                            {Math.round(
                              s.rearmCd *
                                $upgradeEffects.eagleRearmCooldownMult *
                                ($stratagemsOptions.orbitalFluctuations ? 1.25 : 1)
                            )}s
                          </span>
                          {#if $upgradeEffects.eagleEarlyRearmMult < 1}
                            <span class="text-gray-600 dark:text-gray-400">
                              (
                              Early:
                              {Math.round(
                                Math.round(
                                  s.rearmCd *
                                    $upgradeEffects.eagleRearmCooldownMult *
                                    ($stratagemsOptions.orbitalFluctuations ? 1.25 : 1)
                                ) * $upgradeEffects.eagleEarlyRearmMult
                              )}s)
                            </span>
                          {/if}
                        {:else}
                          {calculateCooldown(s, $upgradeEffects, {
                            orbitalFluctuations: $stratagemsOptions.orbitalFluctuations,
                            dssPresence: $stratagemsOptions.dssPresence
                          })}s
                        {/if}
                      </td>
                      <td class="py-1 px-2">
                        {#if s.type === 'limited' && s.maxUses !== undefined}
                          {s.maxUses}
                        {:else if s.type === 'eagle'}
                          {s.baseUsesPerRearm + $upgradeEffects.eagleUsesPerRearmBonus} / rearm (∞)
                        {:else}
                          Unlimited
                        {/if}
                      </td>
                      <td class="py-1 px-2">
                        {#if s.type === 'eagle'}
                          {computeUsesForEagle(s, $upgradeEffects, { orbitalFluctuations: $stratagemsOptions.orbitalFluctuations, dssPresence: $stratagemsOptions.dssPresence }, 300)}
                        {:else}
                          {computeUsesForRegular(
                            s,
                            calculateCooldown(s, $upgradeEffects, {
                              orbitalFluctuations: $stratagemsOptions.orbitalFluctuations,
                              dssPresence: $stratagemsOptions.dssPresence
                            }),
                            300
                          )}
                        {/if}
                      </td>
                      <td class="py-1 px-2">
                        {#if s.type === 'eagle'}
                          {computeUsesForEagle(s, $upgradeEffects, { orbitalFluctuations: $stratagemsOptions.orbitalFluctuations, dssPresence: $stratagemsOptions.dssPresence }, 2400)}
                        {:else}
                          {computeUsesForRegular(
                            s,
                            calculateCooldown(s, $upgradeEffects, {
                              orbitalFluctuations: $stratagemsOptions.orbitalFluctuations,
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
          {/if}
        </section>
      {/if}
    {/each}
  {/key}
{:else}
  <p class="text-gray-600 dark:text-gray-300">Loading stratagems…</p>
{/if}
