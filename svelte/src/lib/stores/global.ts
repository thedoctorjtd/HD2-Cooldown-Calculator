import { persistedWritable } from './persisted';

export interface GlobalOptions {
  orbitalFluctuations: boolean;
}

export const globalOptions = persistedWritable<GlobalOptions>('globalOptions', {
  orbitalFluctuations: false
});

