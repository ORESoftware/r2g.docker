'use strict';

import chalk from "chalk";
const isDebug = process.env.docker_r2g_is_debug === 'yes';

export const log = {
  info: console.log.bind(console, chalk.gray('r2g.docker/info:')),
  warn: console.error.bind(console, chalk.bold.magenta.bold('r2g.docker warn]')),
  error: console.error.bind(console, chalk.redBright.bold('r2g.docker error]')),
  debug: function (...args: any[]) {
    isDebug && console.log(chalk.yellowBright('r2g.docker:'), ...args);
  }
};

export default log;
