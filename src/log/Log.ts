import { Configuration } from '../_contracts';
import { BaseLog } from './BaseLog';
import { Env } from '../Env';
import { Printer } from '../printers';

export class Log extends BaseLog {
  constructor(printer: typeof Printer, env: Env, user_cfg?: Configuration) {
    super(printer, env, user_cfg);
  }

  /**
   * Seals the configuration of a log and returns a function that
   * constructs a new log with the same configuration.
   *
   * **Example:**
   * ```javascript
   * const sealed = adze({ use_emoji: true }).ns('sealed').label('sealed-label').seal();
   * sealed().success('Success!'); // -> prints "#sealed [sealed-label] Success!"
   * sealed().log('Another log.'); // -> prints "#sealed [sealed-label] Another log."
   * ```
   */
  public seal(): () => Log {
    return () => new Log(this.Printer, this.env).hydrate(this.data);
  }
}
