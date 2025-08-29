import { persistedWritable } from './persisted';
import type { Weather } from '$lib/rockets/calculations';

export interface RocketsOptions {
  complexPlotting: boolean;
  orbitalFluctuations: boolean;
  planetWeather: Weather;
  resupplyCount: number;
}

const defaultRocketsOptions: RocketsOptions = {
  complexPlotting: false,
  orbitalFluctuations: false,
  planetWeather: 'Normal',
  resupplyCount: 1
};

export const rocketsOptions = persistedWritable<RocketsOptions>(
  'rocketsOptions',
  defaultRocketsOptions
);

