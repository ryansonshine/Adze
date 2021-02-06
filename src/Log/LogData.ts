import {
  Defaults,
  MetaData,
  LogLevelDefinition,
  LabelData,
  LogTimestamp,
  LogDataValues,
} from '../_contracts';
import { Log } from '.';

export class LogData {
  /**
   * The Adze log instance associated to this log data.
   */
  public readonly log: Log;

  /**
   * Data values derived from an Adze log instance.
   */
  protected readonly values: LogDataValues;

  constructor(log: Log, values: LogDataValues) {
    this.log = log;
    this.values = values;
  }

  public get cfg(): Defaults {
    return this.values.cfg;
  }

  public get level(): number | null {
    return this.values.level;
  }

  public get definition(): LogLevelDefinition | null {
    return this.values.definition;
  }

  public get args(): unknown[] | null {
    return this.values.args;
  }

  public get timestamp(): LogTimestamp | null {
    return this.values.timestamp;
  }

  public get stacktrace(): string | null {
    return this.values.stacktrace;
  }

  public get namespace(): string[] | null {
    return this.values.namespace;
  }

  public get dumpContext(): boolean {
    return this.values.dumpContext;
  }

  public get meta(): MetaData {
    return this.values.meta;
  }

  public get context(): MetaData | null {
    return this.values.context;
  }

  public get label(): LabelData {
    return this.values.label;
  }

  public get timeNow(): string | null {
    return this.values.timeNow;
  }

  public get assertion(): boolean | undefined {
    return this.values.assertion;
  }

  public get expression(): boolean | undefined {
    return this.values.expression;
  }

  public get isSilent(): boolean {
    return this.values.isSilent;
  }
}
