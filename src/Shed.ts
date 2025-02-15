import defaultsDeep from 'lodash/defaultsDeep';
import {
  ShedConfig,
  ShedUserConfig,
  Collection,
  LevelFilter,
  ListenerLocations,
  ListenerBuckets,
  ListenerBucket,
  ListenerCallback,
  LabelMap,
  FinalLogData,
  LogRender,
  Configuration,
} from './_contracts';
import { BaseLog } from './log/BaseLog';
import { Label } from './label';
import { shed_defaults } from './_defaults';
import { formatLevels } from './util';
import { Env } from './Env';

/**
 * A typeguard that indicates that a global Shed store exists.
 */
export function shedExists(store: Shed | undefined): store is Shed {
  return store !== undefined;
}
/**
 * Creates a new Shed instance in your environment's global context.
 */
export function createShed(config?: ShedUserConfig): Shed {
  const env = new Env();
  env.global.$shed = new Shed(env, config);
  return env.global.$shed;
}

/**
 * Removes the Shed from the environment's global context.
 */
export function removeShed(): void {
  delete Env.global().$shed;
}

/**
 * A global store for caching, listening, and recalling Adze logs.
 */
export class Shed {
  /**
   * Instance of the Env class.
   */
  private env: Env = new Env();

  /**
   * The configuration for Shed. Shed is constructed with a set of
   * defaults that can overriden by the configuration supplied by the user.
   */
  private cfg: ShedConfig;

  /**
   * In-memory cache of finalized logs (terminated and have meta data applied to them). This
   * is mainly used for recalling logs and filtering them.
   *
   * Do not access this value directly. Use the `cache()` setter and getter.
   */
  private _cache: Collection = [];

  /**
   * Cache of label instances. Useful for globally linking labelled logs.
   */
  private labels: LabelMap = new Map();

  /**
   * Counter for generating ID's for listeners.
   */
  private id_counter = -1;

  /**
   * Cache of log listeners. These are fire when specified log levels
   * are printed.
   */
  private listeners: ListenerBuckets = new Map();

  constructor(env: Env, config?: ShedUserConfig) {
    this.env = env;
    this.cfg = this.formatConfig(config);
  }

  /*************************************\
   * GET/SET METHODS
  \*************************************/

  /**
   * Store a log in the Shed.
   */
  public store(log: BaseLog): void {
    if (this.cacheSize < this.cfg.cache_limit) {
      this._cache = this._cache.concat([log]);
    }
  }

  /**
   * Sets the limit for the maximum number of logs that Shed will cache.
   */
  public set cacheLimit(limit: number) {
    this.cfg.cache_limit = limit;
  }

  /**
   * Gets the limit for the maximum number of logs that Shed will cache.
   */
  public get cacheLimit(): number {
    return this.cfg.cache_limit;
  }

  /**
   * Returns the current number of logs cached in the Shed.
   */
  public get cacheSize(): number {
    return this._cache.length;
  }

  /**
   * Returns all of the cached logs of the provided levels as a bundle.
   * This is useful for recalling logs and applying filters.
   */
  public getCollection(levels: LevelFilter): Collection {
    const lvls = formatLevels(levels, this.cfg.global_cfg);
    return this._cache.reduce((acc, log) => {
      return acc.concat(lvls.includes(log.level ?? Infinity) ? [log] : []);
    }, [] as Collection);
  }

  /**
   * Indicates whether this Shed instance has global Adze config overrides set.
   */
  public get hasOverrides(): boolean {
    return this.cfg.global_cfg !== null;
  }

  /**
   * Returns the current value of the global Adze configuration overrides.
   */
  public get overrides(): Configuration | null {
    return this.cfg.global_cfg;
  }

  /**
   * Sets the value of the Shed configuration.
   */
  public set config(cfg: ShedUserConfig | undefined) {
    this.cfg = this.formatConfig(cfg);
  }

  /**
   * Takes a Shed and formats it to merge shed defaults and
   * global config overrides with defaults. It also pre-parses any level
   * filters for performance reasons.
   */
  private formatConfig(cfg: ShedUserConfig | undefined): ShedConfig {
    const global_cfg = cfg?.global_cfg ?? null;

    const cfg_global_defaults = { ...cfg, global_cfg };
    return defaultsDeep(cfg_global_defaults, shed_defaults) as ShedConfig;
  }

  /**
   * Get a label instance from the Shed by name.
   */
  public getLabel(name: string): Label | undefined {
    return this.labels.get(name);
  }

  /**
   * Adds a label to the Shed to be tracked globally.
   */
  public addLabel(label: Label): void {
    if (!this.hasLabel(label.name)) {
      this.labels.set(label.name, label);
    }
  }

  /**
   * Validates whether a label with the given name exists in the Shed label cache.
   */
  public hasLabel(name: string): boolean {
    return this.labels.has(name);
  }

  /*************************************\
   * LISTENER METHODS
  \*************************************/

  /**
   * Add a listener callback that fires any time a log of one of the provided levels is terminated.
   */
  public addListener(
    levels: LevelFilter,
    cb: ListenerCallback
  ): ListenerLocations {
    const lvls = formatLevels(levels, this.cfg.global_cfg);
    return lvls.map((lvl: number) => {
      // Get the map for the listeners of the given log level.
      const level_map = this.listenerBucket(lvl);
      // Generate a new ID for the listener.
      const id = this.assignId();

      // Assign an ID to the listener for later teardown.
      level_map.set(id, cb);
      this.listeners.set(lvl, level_map);

      // Return the listener location tuple
      return [lvl, id];
    });
  }

  /**
   * Remove log listeners at the provided locations.
   */
  public removeListener(locations: ListenerLocations): void {
    locations.forEach(([lvl_id, id]) => {
      const level = this.listeners.get(lvl_id);
      level?.delete(id);
    });
  }

  /**
   * Fires any listeners that are watching the log level defined in the provided log data. The log data
   * and render object will be passed to the listener callback.
   */
  public fireListeners(log: FinalLogData, render: LogRender | null): void {
    this.listeners.get(log.level)?.forEach((listener) => {
      listener(log, render);
    });
  }

  /*************************************\
   * HELPER METHODS
  \*************************************/

  /**
   * Guarantee that a listener bucket exists for the given log level and return the bucket.
   */
  private listenerBucket(lvl: number): ListenerBucket {
    if (!this.listeners.has(lvl)) {
      this.listeners.set(lvl, new Map());
    }
    // Override TS because the ListenerBucket is guaranteed by the condition above.
    return this.listeners.get(lvl) as ListenerBucket;
  }

  /**
   * Increment the ID counter and return the new value.
   */
  private assignId(): number {
    return (this.id_counter += 1);
  }
}
