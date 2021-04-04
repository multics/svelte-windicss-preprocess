import { StyleSheet } from 'windicss/utils/style';
import type { Options } from './interfaces';

export function combineStyleList(stylesheets: StyleSheet[]) {
  return stylesheets
    .reduce((previousValue, currentValue) => previousValue.extend(currentValue), new StyleSheet())
    .combine(); //.sort();
}

export function globalStyleSheet(styleSheet: StyleSheet) {
  // turn all styles in stylesheet to global style
  styleSheet.children.forEach(style => {
    if (!style.rule.includes(':global') && style.meta.group!=='keyframes') {
      style.wrapRule((rule: string) => `:global(${rule})`);
    }
  });
  return styleSheet;
}

export function writeFileSync(path: string, data: string) {
  if (!process.env.BROWSER) return require('fs').writeFileSync(path, data);
}

export async function loadConfig(config?: string) {
  if (process.env.BROWSER) return config;
  return config ? await import(require('path').resolve(config)) : undefined;
}

export function chalkColor() {
  const chalk = require('chalk');
  return {
    blueBold: (text: string) => chalk.hex('#0ea5e9').bold(text),
    blackBold: (text: string) => chalk.hex('#000').bold(text),
    yellowBold: (text: string) => chalk.hex('#FFB11B').bold(text),
    redBold: (text: string) => chalk.hex('#FF4000').bold(text),
    green: (text: string) => chalk.hex('#00D17A')(text),
    gray: (text: string) => chalk.hex('#717272')(text),
  };
}

export function logging(options: Options) {
  const chalk = chalkColor();
  process.stdout.write(`${chalk.blueBold('│')}\n`);
  process.stdout.write(`${chalk.blueBold('│')} ${chalk.blueBold('svelte-windicss-preprocess')}\n`);
  process.stdout.write(
    `${chalk.blueBold('│')} ${process.env.NODE_ENV == undefined ? chalk.redBold('NODE_ENV is undefined') : ''}\n`
  );
  process.stdout.write(
    `${chalk.blueBold('│')} ${chalk.blackBold('-')} windicss running mode: ${process.env.NODE_ENV === 'development'
      ? chalk.yellowBold('dev')
      : process.env.NODE_ENV === 'production'
        ? chalk.green('prod')
        : chalk.yellowBold('process.env.NODE_ENV check failed (check setup)')
    }\n`
  );
  process.stdout.write(
    `${chalk.blueBold('│')} ${chalk.blackBold('-')} advanced debug logs: ${options?.debug === true ? chalk.yellowBold('on') : chalk.green('off')
    }\n`
  );

  process.stdout.write(
    `${chalk.blueBold('│')}    ${chalk.blackBold('•')} compilation mode: ${options?.compile == true ? chalk.gray('enabled') : chalk.gray('disabled')
    }\n`
  );
  process.stdout.write(
    `${chalk.blueBold('│')}    ${chalk.blackBold('•')} class prefix: ${options?.prefix ? chalk.gray(options.prefix) : chalk.yellowBold('not set')
    }\n`
  );

  process.stdout.write(`${chalk.blueBold('│')}\n`);
  process.stdout.write(`${chalk.blueBold('└──────────')}\n`);
}
