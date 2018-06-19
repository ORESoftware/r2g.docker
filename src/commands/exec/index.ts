#!/usr/bin/env node
'use strict';

const argv = process.argv.slice(2);
import * as m from './run';
import * as assert from 'assert';
import log from '../../logger';

import {opts, projectRoot, cwd} from '../../parse-cli-options';

const acceptableNodeVersions = ['4', '5', '6', '7', '8', '9', '10'];

try {
  assert(acceptableNodeVersions.includes(opts.node_version));
}
catch (err) {
  log.error('You need to pass an acceptable node version.');
  log.error('Acceptable node versions include:', acceptableNodeVersions);
  process.exit(1);
}

m.run(cwd, projectRoot, opts, argv);

