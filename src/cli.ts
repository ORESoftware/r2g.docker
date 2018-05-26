#!/usr/bin/env node
'use strict';

import cp = require('child_process');
import path = require("path");
import async = require('async');
import log from './logger';
import residence = require('residence');
const contents = path.resolve(__dirname + '/../assets/contents');
const cwd = process.cwd();
const projectRoot = residence.findProjectRoot(cwd);
import {opts} from './parse-cli-options';
let p: Promise<{ run: (cwd: string, projectRoot: string) => void }>;

if (opts.init) {
  p = import('./commands/init');
}
else if (opts.run) {
  p = import('./commands/run');
}
else if (opts.exec) {
  p = import('./commands/exec');
}
else {
  throw new Error('No option matched.');
}

p.then(function (m) {
  return m.run(cwd, projectRoot);
})
.catch(function (err) {
  log.error(err);
});




