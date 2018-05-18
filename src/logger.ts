'use strict';

export const log = {
  info: console.log.bind(console, 'docker.r2g'),
  warn: console.error.bind(console, 'docker.r2g'),
  error: console.error.bind(console, 'docker.r2g'),
};

export default log;
