import { RecursivePartial, ChalkStyle } from '.';

export type ConsoleMethod =
  | 'error'
  | 'warn'
  | 'info'
  | 'log'
  | 'debug'
  | 'trace'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'table'
  | 'dir'
  | 'dirxml';

export interface Defaults {
  log_level: number;
  use_emoji: boolean;
  capture_stacktrace: boolean;
  base_style: string;
  log_levels: LogLevels;
  custom_levels: Partial<LogLevels>;
  filters: Filters;
  meta: {
    [key: string]: unknown;
  };
}

export type LogLevels = {
  [method: string]: LogLevelDefinition;
};

export interface LogLevelDefinition {
  level: number;
  levelName?: string;
  method: ConsoleMethod;
  style: string;
  terminal: ChalkStyle[];
  emoji: string;
}

export interface Filters {
  hideAll: boolean;
  namespace: FilterOptions;
  label: FilterOptions;
}

export interface FilterOptions {
  hideAll: boolean;
  exclude: string[];
  include: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Configuration extends RecursivePartial<Defaults> {}