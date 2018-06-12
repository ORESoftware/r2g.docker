'use strict';

import chalk from "chalk";
const isDebug = process.env.docker_r2g_is_debug === 'yes';

export const log = {
  info: console.log.bind(console, chalk.gray('[docker.r2g info]')),
  warn: console.error.bind(console, chalk.bold.magenta.bold('[docker.r2g warn]')),
  error: console.error.bind(console, chalk.redBright.bold('[docker.r2g error]')),
  debug: function (...args: any[]) {
    isDebug && console.log('docker.r2g', ...arguments);
  }
};

export default log;
