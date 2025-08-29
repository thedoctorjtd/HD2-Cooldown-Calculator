<script lang="ts">
  import { ROCKETS } from '$lib/utils/dataLoader';
  import { upgradeEffects, rocketsOptions, globalOptions } from '$lib/stores';
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
      orbitalFluctuations: $globalOptions.orbitalFluctuations,
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

<div class="container">
  <div class="mission-config">
    <h2>Mission Configuration</h2>
    <div class="config-row">
      <label>
        <input type="checkbox" bind:checked={$globalOptions.orbitalFluctuations} />
        Orbital Fluctuations (+25% Cooldowns)
      </label>
    </div>
    <div class="config-row">
      <label>
        <input type="checkbox" bind:checked={$rocketsOptions.complexPlotting} />
        Complex Stratagem Plotting (+50% Call-in Time)
      </label>
    </div>
    <div class="config-row">
      <label for="weather">Planet Weather:</label>
      <select id="weather" bind:value={$rocketsOptions.planetWeather}>
        <option value="Normal">Normal</option>
        <option value="Cold">Cold</option>
        <option value="Hot">Hot</option>
      </select>
    </div>
    <div class="config-row">
      <label for="resupply">Resupplies per Pod:</label>
      <select id="resupply" bind:value={$rocketsOptions.resupplyCount}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
      </select>
    </div>
  </div>

  <div>
    <table>
      <thead>
        <tr>
          <th>Weapon</th>
          <th>Avg Sec/Shot</th>
          <th>Shots / 5 Min</th>
          <th>Shots / 40 Min</th>
        </tr>
      </thead>
      <tbody>
        {#each rockets as w}
          <tr>
            <td>{w.name}</td>
            <td>{avgSecPerShot(shots(w, T40))}</td>
            <td>{shots(w, T5)}</td>
            <td>{shots(w, T40)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if rockets.length === 0}
      <p>No rocket data found.</p>
    {/if}
  </div>

  <div class="disclaimer">
    <p>
      <em>
        Disclaimer: Due to the Commando's low damage output—requiring two rockets per kill—the ammo capacity is
        effectively halved for these calculations.
      </em>
    </p>
  </div>
</div>
