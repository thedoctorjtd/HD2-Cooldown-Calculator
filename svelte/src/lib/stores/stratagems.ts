import { persistedWritable } from './persisted';

export interface StratagemsOptions {
  orbitalFluctuations: boolean;
  dssPresence: boolean;
  search: string;
  categoryOpenState: Record<string, boolean>;
}

const defaultOptions: StratagemsOptions = {
  orbitalFluctuations: false,
  dssPresence: false,
  search: '',
  categoryOpenState: {}
};

export const stratagemsOptions = persistedWritable<StratagemsOptions>(
  'stratagemsOptions',
  defaultOptions
);

