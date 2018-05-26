'use strict';

import chalk from "chalk";
const isDebug = process.env.docker_r2g_is_debug === 'yes';

export const log = {
  info: console.log.bind(console, chalk.gray('docker.r2g')),
  warn: console.error.bind(console, chalk.bold('docker.r2g')),
  error: console.error.bind(console, chalk.redBright.bold('docker.r2g')),
  debug: function () {
    if (isDebug) {
      console.log('docker.r2g', ...arguments);
    }
  }
};

export default log;
