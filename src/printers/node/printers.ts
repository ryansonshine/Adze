import * as chalk from 'chalk';
import { Log, LogLevelDefinition, LogRender, Defaults, ConsoleMethod } from '../../_contracts';
import { toConsole, applyRender } from '../shared';
import { env } from '../../global';
import { initialCaps } from '../../util';

// ------- PRINT METHODS -------- //

export function printLog(this: Log, cfg: Defaults, levelName: string, use_emoji: boolean, args: any[]):LogRender {
  const def = { ...cfg.log_levels[levelName], levelName };
  const [ method, leader, meta ] = [ def.method, fLeader(def, use_emoji, args), fMeta(this) ];
  const render_args = meta === '' ? [ leader, ...args ] : [ leader, meta, ...args ];
  return toConsole(applyRender(this, method, render_args ));
}

export function printGroup(this: Log, cfg: Defaults, levelName: string, use_emoji: boolean, args: any[]):LogRender {
  const render_args = setupPrintGroup(cfg, levelName, use_emoji, args);
  return toConsole(applyRender(this, 'group', render_args));
}

export function printGroupCollapsed(this: Log, cfg: Defaults, levelName: string, use_emoji: boolean, args: any[]):LogRender {
  const def = { ...cfg.log_levels[levelName], levelName };
  const partial_args = [ fLeader(def, use_emoji, args) ];
  const render_args = typeof args[0] === "string" ? [ ...partial_args, args[0] ] : partial_args;
  return toConsole(applyRender(this, 'groupCollapsed', render_args));
}

function setupPrintGroup(cfg: Defaults, levelName: string, use_emoji: boolean, args: any[]):any[] {
  const def = { ...cfg.log_levels[levelName], levelName };
  const partial_args = [ fLeader(def, use_emoji, args) ];
  return typeof args[0] === "string" ? [ ...partial_args, args[0] ] : partial_args;
}

// ------- PRINT FORMATTERS -------- //

export function fLeader(def: LogLevelDefinition, use_emoji: boolean, args: any[]):string {
  const emoji = use_emoji ? fEmoji(def.emoji) : '';
  const padding = use_emoji ? (14 + emoji.length) : 14;
  const padded_leader = addPadding(`${emoji} ${fName(def.levelName)}(${args.length})`, padding);
  
  return def.terminal.reduce((acc, style) => {
    return chalk[style](acc);
  }, padded_leader);
}

function addPadding(str: string, len: number):string {
  const diff = len - str.length;
  let padded = str;
  for (let i = 0; i <= diff; i += 1) {
    padded += ' ';
  }
  return padded;
}

function fEmoji(emoji: string):string {
  return ` ${emoji}`;
}

function fName(name: string|undefined):string {
  return initialCaps(name ?? '');
}

export function fMeta(ctxt: Log):string {
  return `${fNamespace(ctxt)}${fLabel(ctxt)}${fTime(ctxt)}${fCount(ctxt)}`;
}

function fTime(ctxt: Log):string {
  const label_txt = `${ctxt.labelVal?.timeNow ?? ctxt.labelVal?.timeEllapsed ?? ''}`;
  return label_txt !== '' ? ` (${env.$shed?.cfg?.use_emoji ? '⏱' : ''}${label_txt}) ` : '';
}

function fCount(ctxt: Log):string {
  const count = ctxt.labelVal?.count;
  return count !== undefined ? `(Count: ${count})` : '';
}

function fNamespace(ctxt: Log):string {
  return ctxt.namespaceVal ? `#${ctxt.namespaceVal} ` : '';
}

function fLabel(ctxt: Log):string {
  return ctxt.labelVal ? `[${ctxt.labelVal.name}] ` : '';
}