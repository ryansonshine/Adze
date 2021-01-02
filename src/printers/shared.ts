import { Log, LogRender, Defaults, ConsoleMethod, LogLevelDefinition } from "../_contracts";
import { env } from '../global';

// ------- PRINT ENTRY -------- //

export function print(log: Log, def: LogLevelDefinition, args: any[]):LogRender {
  const use_emoji = env.$shed?.overrides?.use_emoji === true || log.cfg.use_emoji === true;
  return log.printer(log, def, use_emoji, args);
}

// ------- PRINT METHODS -------- //

export function printGroupEnd(log: Log, def: LogLevelDefinition, use_emoji: boolean, args: any[]):LogRender {
  return toConsole(applyRender(log, 'groupEnd', []));
}

export function printTable(log: Log, def: LogLevelDefinition, use_emoji: boolean, args: any[]):LogRender {
  return toConsole(applyRender(log, 'table', args), false);
}

export function printDir(log: Log, def: LogLevelDefinition, use_emoji: boolean, args: any[]):LogRender {
  return toConsole(applyRender(log, 'dir', args), false);
}

export function printDirxml(log: Log, def: LogLevelDefinition, use_emoji: boolean, args: any[]):LogRender {
  return toConsole(applyRender(log, 'dirxml', args), false);
}

export function printTrace(log: Log, def: LogLevelDefinition, use_emoji: boolean, args: any[]):LogRender {
  return toConsole(applyRender(log, 'trace', args));
}

// ------ Print to the console ------- //

export function applyRender(log: Log, method: ConsoleMethod, args: any[]):LogRender {
  const expanded_args = log.dumpContext ? args.concat([log.context]) : args;
  log.render = [method, expanded_args];
  return log.render;
}

/**
 * Render the log. If the ADZE_ENV is set to "dev" the log will not render and 
 * will be returned for unit library development purposes.
 */
export function toConsole(render: LogRender, spread = true):LogRender {
  const [method, args] = render;
  if (env.ADZE_ENV !== 'dev') {
    spread ? console[method](...args) : console[method](args);
  }
  return render;
}