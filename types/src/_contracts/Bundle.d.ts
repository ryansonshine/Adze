import { Log } from '.';
/**
 * An extension of a Log that adds a getter for the log bundle.
 */
export interface BundledLog extends Log {
    readonly bundle: Bundle;
}
/**
 * Generates a new bundled log.
 */
export declare type Bundler = () => BundledLog;
/**
 * Array of bundled logs.
 */
export declare type Bundle = BundledLog[];
