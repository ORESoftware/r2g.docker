'use strict';

import cp = require('child_process');
import path = require("path");
import fs = require('fs');
import async = require('async');
import {getCleanTrace} from 'clean-trace';
import chalk from 'chalk';
import pt from 'prepend-transform';

// project
import log from '../../logger';
import * as util from "util";
import {getFSMap} from "./get-fs-map";
import * as assert from "assert";

//////////////////////////////////////////////////////////////////////////////////////

export interface Packages {
  [key: string]: boolean | string
}

export const run = function (cwd: string, projectRoot: string, opts: any) {

  const userHome = path.resolve(process.env.HOME);

  let pkgJSON = null, docker2gConf = null, packages: Packages = null, searchRoot = '', pkgName = '';

  const pkgJSONPth = path.resolve(projectRoot + '/package.json');

  try {
    pkgJSON = require(pkgJSONPth);
    pkgName = pkgJSON.name;
  }
  catch (err) {
    log.error(chalk.magentaBright('Could not read your projects package.json file.'));
    throw getCleanTrace(err);
  }

  if (!(pkgName && typeof pkgName === 'string')) {
    throw new Error(
      'Your package.json file does not appear to have a proper name field. Here is the file:\n' + util.inspect(pkgJSON)
    );
  }

  pkgName = String(pkgName).replace(/[^0-9a-z]/gi, '');

  try {
    docker2gConf = require(projectRoot + '/.docker.r2g/config.js');
    docker2gConf = docker2gConf.default || docker2gConf;
    packages = docker2gConf.packages;
    searchRoot = path.resolve(docker2gConf.searchRoot);
  }
  catch (err) {
    log.error(chalk.magentaBright('Could not read your .docker.r2g/config.js file.'));
    throw getCleanTrace(err);
  }

  if (!(packages && typeof packages === 'object')) {
    throw new Error('You need a property called "packages" in your .docker.r2g/config.js file.');
  }

  if (!(searchRoot && typeof searchRoot === 'string')) {
    throw new Error('You need a property called "searchRoot" in your .docker.r2g/config.js file.');
  }

  if (!path.isAbsolute(searchRoot)) {
    throw new Error('Your "searchRoot" property in your .docker.r2g/config.js file, needs to be an absolute path.');
  }

  try {
    assert(fs.statSync(searchRoot).isDirectory());
  }
  catch (err) {
    log.error('Your "searchRoot" property does not seem to exist as a directory on the local/host filesystem.');
    log.error('A.K.A., the following path does not seem to be a directory:');
    log.error(searchRoot);
    throw getCleanTrace(err);
  }

  if (!searchRoot.startsWith(userHome)) {
    throw new Error('Your searchRoot needs to be within your user home directory.');
  }

  const dependenciesToInstall = Object.keys(packages);
  if (dependenciesToInstall.length < 1) {
    log.warn('You should supply some packages to link, otherwise this is somewhat pointless.');
    log.warn('Here is your configuration:\n', docker2gConf);
  }

  const deps = [
    pkgJSON.dependencies || {},
    pkgJSON.devDependencies || {},
    pkgJSON.optionalDependencies || {}
  ];

  const allDeps = deps.reduce(Object.assign, {});

  deps.forEach(function (d) {
    Object.keys(d).forEach(function (k) {
      const v = d[k];
    });
  });

  Object.keys(packages).forEach(function (k) {
    if (!allDeps[k]) {
      log.warn(chalk.gray('You have the following packages key in your .docker.r2g/config.js file:'), chalk.magentaBright(k));
      log.warn(chalk.bold('But the above key is not present as a dependency in your package.json file.'));
    }
  });

  let mapObject = function (obj: any, fn: Function, ctx?: object) {
    return Object.keys(obj).reduce((a: any, b) => {
      return (a[b] = fn.call(ctx || null, b, obj[b])), a;
    }, {});
  };

  const r2g_shared_dir = '/r2g_shared_dir';

  async.autoInject({

      getMap: function (cb: Function) {
        getFSMap(searchRoot, packages, cb);
      },

      launchTool: function (getMap: any, cb: Function) {

        const ln = searchRoot.length;

        const mapped = mapObject(getMap, function (k: string, v: any) {
          return path.resolve(r2g_shared_dir + String(v).slice(ln));
        });

        const map = JSON.stringify(mapped);

        const k = cp.spawn('bash', [], {
          cwd: projectRoot,
          env: Object.assign({}, process.env, {
            docker_r2g_package_name: pkgName,
            docker_r2g_search_root: searchRoot,
            docker_r2g_fs_map: map,
            docker_r2g_shared_dir: r2g_shared_dir
          })
        });

        k.stdout.pipe(pt(chalk.blueBright('[docker.r2g]  '))).pipe(process.stdout);
        k.stderr.pipe(pt(chalk.magenta('[docker.r2g]  '))).pipe(process.stderr);

        k.stdin.end(`./.docker.r2g/exec.sh`);
        k.once('exit', function (code) {
          cb(null, {exitCode: code});
        });

      }

    },

    function (err, results) {

      if (err) {
        throw getCleanTrace(err);
      }

      log.info(chalk.bold('All done, with results being:'));
      Object.keys(results).forEach(function (k) {
        log.info(
          chalk.blueBright.bold(k), ':',
          chalk.blueBright(util.inspect(results[k], {breakLength: Infinity}))
        );
      });

    });

};
