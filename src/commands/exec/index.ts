#!/usr/bin/env node
'use strict';

const argv = process.argv.slice(2);
import {opts, projectRoot, cwd} from '../../parse-cli-options';
import * as m from './run';
m.run(cwd, projectRoot, opts, argv);

