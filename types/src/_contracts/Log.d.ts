import { BaseLog } from '../log';
import { LogLevelDefinition, ConsoleMethod, Defaults, LabelData } from '.';
/**
 * The keys of the default terminating log methods included with Adze.
 */
export declare type TerminatingMethodKeys = 'alert' | 'error' | 'warn' | 'fail' | 'success' | 'info' | 'log' | 'debug' | 'verbose';
/**
 * To keep the size of this library down we are providing
 * the user with standard browser timestamp values.
 */
export interface LogTimestamp {
    unixMilli: number;
    utc: string;
}
declare type PrintMethodNames = 'Dir' | 'Dirxml' | 'Log' | 'Group' | 'GroupCollapsed' | 'GroupEnd' | 'Trace' | 'Table';
/**
 * Printer class method names. This is used within Log internally
 * for selecting which Printer method to use to render the Log.
 */
export declare type PrintMethod = `print${PrintMethodNames}`;
/**
 * Interface for unknown meta data values provided by the user.
 */
export interface MetaData {
    [key: string]: unknown;
}
/**
 * The render value for a Log.
 */
declare type Arguments = unknown[];
export declare type LogRender = [ConsoleMethod, Arguments];
/**
 * Type alias for an array of Log instances.
 */
export declare type Collection = BaseLog[];
/**
 * Log data object generated from a Log instance. This is
 * primarily used for listeners and log cloning.
 */
export interface LogData {
    args: unknown[] | null;
    assertion?: boolean;
    cfg: Defaults;
    context: MetaData;
    definition: LogLevelDefinition | null;
    dumpContext: boolean;
    expression?: boolean;
    isSilent: boolean;
    label: LabelData;
    level: number | null;
    meta: MetaData;
    modifierQueue: Array<(ctxt: BaseLog) => void>;
    namespace: string[] | null;
    stacktrace: string | null;
    timeNow: string | null;
    timestamp: LogTimestamp | null;
}
/**
 * Log data object generated from a Log instance after it
 * has been terminated. The values in this extended interface
 * reflect that they are no longer possibly null.
 */
export interface FinalLogData extends LogData {
    level: number;
    definition: LogLevelDefinition;
    args: unknown[];
    timestamp: LogTimestamp;
}
/**
 * The final value of a log after it has been terminated. This is useful for
 * gleaning the final render information and getting the Log instance for
 * unit testing purposes.
 */
export interface TerminatedLog<I extends BaseLog> {
    log: I;
    render: LogRender | null;
}
export {};
