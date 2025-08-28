<script lang="ts">
  import { ROCKETS } from '$lib/utils/dataLoader';
  import { upgradeEffects, rocketsOptions } from '$lib/stores';
  import {
    computeExpendableShots,
    computeBackpackShots,
    computeEnergyShots
  } from '$lib/rockets/calculations';

  type RocketType = 'Expendable' | 'Backpack' | 'Energy';
  interface RocketEntry {
    name: string;
    type: RocketType;
    stratCooldown: number;
    stratCallInTime: number;
    reloadTime: number;
    weaponChargeUp: number;
    weaponDamage: number;
    rounds: number;
    travelTime: number;
  }

  const rockets = ROCKETS as RocketEntry[];
  const T5 = 300;
  const T40 = 2400;

  function shots(weapon: RocketEntry, total: number): number {
    const opts = {
      effects: $upgradeEffects,
      complexPlotting: $rocketsOptions.complexPlotting,
      orbitalFluctuations: $rocketsOptions.orbitalFluctuations,
      planetWeather: $rocketsOptions.planetWeather,
      resupplyCount: $rocketsOptions.resupplyCount
    } as const;
    if (weapon.type === 'Expendable') return computeExpendableShots(weapon, total, opts);
    if (weapon.type === 'Backpack') return computeBackpackShots(weapon, total, opts);
    return computeEnergyShots(weapon, total, opts);
  }

  function avgSecPerShot(shots40: number): string | number {
    return shots40 > 0 ? Math.round(T40 / shots40) : '∞';
  }
</script>

<h1 class="text-xl font-semibold mb-4">Rockets</h1>

<section class="grid gap-4 md:grid-cols-3 mb-6">
  <div class="flex items-center gap-4">
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" bind:checked={$rocketsOptions.orbitalFluctuations} />
      Orbital fluctuations
    </label>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" bind:checked={$rocketsOptions.complexPlotting} />
      Complex plotting
    </label>
  </div>

  <div class="flex items-center gap-2">
    <label class="text-sm" for="weather">Planet weather</label>
    <select
      id="weather"
      class="rounded border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 px-2 py-1 text-sm"
      bind:value={$rocketsOptions.planetWeather}
    >
      <option value="Normal">Normal</option>
      <option value="Hot">Hot</option>
      <option value="Cold">Cold</option>
    </select>
  </div>

  <div class="flex items-center gap-2 justify-end">
    <label class="text-sm" for="resupply">Resupplies per pod</label>
    <select
      id="resupply"
      class="rounded border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 px-2 py-1 text-sm"
      bind:value={$rocketsOptions.resupplyCount}
    >
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </select>
  </div>
</section>

<div class="overflow-x-auto">
  <table class="min-w-full text-sm">
    <thead class="text-left text-gray-600 dark:text-gray-300">
      <tr>
        <th class="py-1 px-2">Weapon</th>
        <th class="py-1 px-2">Avg Sec/Shot</th>
        <th class="py-1 px-2">Shots / 5 Min</th>
        <th class="py-1 px-2">Shots / 40 Min</th>
      </tr>
    </thead>
    <tbody>
      {#each rockets as w}
        <tr class="border-t border-gray-200 dark:border-gray-800">
          <td class="py-1 px-2">{w.name}</td>
          <td class="py-1 px-2">{avgSecPerShot(shots(w, T40))}</td>
          <td class="py-1 px-2">{shots(w, T5)}</td>
          <td class="py-1 px-2">{shots(w, T40)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if rockets.length === 0}
    <p class="text-gray-600 dark:text-gray-300">No rocket data found.</p>
  {/if}
</div>
