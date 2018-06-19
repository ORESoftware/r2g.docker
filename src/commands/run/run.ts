'use strict';

import cp = require('child_process');
import path = require("path");
import async = require('async');
import {getCleanTrace} from 'clean-trace';

// project
import log from '../../logger';
import {installDeps} from './install-deps';
import {renameDeps} from './rename-file-deps';
import * as util from "util";
import chalk from "chalk";
import * as fs from "fs";

///////////////////////////////////////////////

export const run = function (cwd: string, projectRoot: string, opts: any) {

  let pkgJSON = null, docker2gConf = null, packages = null, fsMap: any = null;

  const pkgJSONPth = path.resolve(projectRoot + '/package.json');

  try {
    pkgJSON = require(pkgJSONPth);
  }
  catch (err) {
    log.error(chalk.magentaBright('Could not read your projects package.json file.'));
    throw getCleanTrace(err);
  }

  try {
    docker2gConf = require(projectRoot + '/.r2g/config.js');
    docker2gConf = docker2gConf.default || docker2gConf;
    packages = docker2gConf.packages;
  }
  catch (err) {
    log.error(chalk.magentaBright('Could not read your .r2g/config.js file.'));
    throw getCleanTrace(err);
  }

  const dependenciesToInstall = Object.keys(packages || {});
  if (dependenciesToInstall.length < 1) {
    log.warn('You should supply some packages to link, otherwise this is not as useful.');
    log.warn('here is your configuration: ', docker2gConf);
  }

  try {
    fsMap = JSON.parse(process.env.docker_r2g_fs_map)
  }
  catch (err) {
    log.error('could not parse the fs map from the env var.');
    throw getCleanTrace(err);
  }

  async.autoInject({

      copyProjectsInMap: function (cb: any) {
        installDeps(fsMap, dependenciesToInstall, cb);
      },

      renamePackagesToAbsolute: function (copyProjectsInMap: any, cb: any) {
        renameDeps(copyProjectsInMap, pkgJSONPth, cb);
      },

      runNpmInstall: function (renamePackagesToAbsolute: any, cb: any) {
        const k = cp.spawn('bash');
        const cmd = `npm install --silent;`;
        log.info('now running the following command:',chalk.green(cmd));
        k.stdin.end(cmd);
        k.stderr.pipe(process.stderr);
        k.once('exit', cb);
      },

      runLocalTests: function (runNpmInstall: any, cb: Function) {

        log.info(chalk.magentaBright('now running local tests'));
        process.nextTick(cb);

      },

      r2g: function (runLocalTests: any, cb: Function) {
        log.info('running r2g tests');
        const k = cp.spawn('bash');
        k.stdin.end('r2g run;');
        k.stdout.pipe(process.stdout);
        k.stderr.pipe(process.stderr);
        k.once('exit', cb as any);
      }

    },

    function (err: any, results) {

      if (err && err.OK === true) {
        log.info('Successfully run this baby, with a warning:', util.inspect(err, {breakLength: Infinity}));
      }
      else if (err) {
        throw getCleanTrace(err);
      }

      log.info('Successfully ran docker.r2g')

    });

};

