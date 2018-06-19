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
import {ErrorValueCallback} from "../../index";


//////////////////////////////////////////////////////////////////////////////////////

export interface Packages {
  [key: string]: boolean | string
}

export const run = function (cwd: string, projectRoot: string, opts: any, argv: Array<string>) {

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

  pkgName = String(pkgName).replace(/[^0-9a-z]/gi, '_');

  if(pkgName.startsWith('_')){
    pkgName = pkgName.slice(1);
  }

  try {
    docker2gConf = require(projectRoot + '/.r2g/config.js');
    docker2gConf = docker2gConf.default || docker2gConf;
    packages = docker2gConf.packages;
    searchRoot = path.resolve(docker2gConf.searchRoot);
  }
  catch (err) {
    log.error(chalk.magentaBright('Could not read your .r2g/config.js file.'));
    throw getCleanTrace(err);
  }

  if (!(packages && typeof packages === 'object')) {
    throw new Error('You need a property called "packages" in your .r2g/config.js file.');
  }

  if (!(searchRoot && typeof searchRoot === 'string')) {
    throw new Error('You need a property called "searchRoot" in your .r2g/config.js file.');
  }

  if (!path.isAbsolute(searchRoot)) {
    throw new Error('Your "searchRoot" property in your .r2g/config.js file, needs to be an absolute path.');
  }

  try {
    assert(fs.lstatSync(searchRoot).isDirectory());
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
      log.warn(chalk.gray('You have the following packages key in your .r2g/config.js file:'), chalk.magentaBright(k));
      log.warn(chalk.bold(`But "${chalk.magentaBright(k)}" is not present as a dependency in your package.json file.`));
    }
  });

  let mapObject = function (obj: any, fn: Function, ctx?: object) {
    return Object.keys(obj).reduce((a: any, b) => {
      return (a[b] = fn.call(ctx || null, b, obj[b])), a;
    }, {});
  };

  const r2g_shared_dir = '/r2g_shared_dir';

  async.autoInject({

      getMap (cb: ErrorValueCallback) {
        getFSMap(opts, searchRoot, packages, cb);
      },

      checkIfExecFileExists(cb: ErrorValueCallback){

        const f = path.resolve(projectRoot + '/.r2g/exec.sh');

        fs.stat(f, function(err){
           cb(null, err);
        });

      },

      launchTool (getMap: any, checkIfExecFileExists: any, cb: ErrorValueCallback) {

        if(checkIfExecFileExists){
          return process.nextTick(cb, new Error('Looks like the needed ".r2g/exec.sh" file does not exist in your project.'));
        }

        const ln = searchRoot.length;

        const mapped = mapObject(getMap, function (k: string, v: any) {
          return path.resolve(r2g_shared_dir + String(v).slice(ln));
        });

        const map = JSON.stringify(mapped);

        log.info('argv for dkr2g exec/run:', argv);

        const k = cp.spawn('./.r2g/exec.sh', argv, {
          cwd: projectRoot,
          env: Object.assign({}, process.env, {
            docker_r2g_package_name: pkgName,
            docker_r2g_search_root: searchRoot,
            docker_r2g_fs_map: map,
            docker_r2g_shared_dir: r2g_shared_dir,
            r2g_node_version: opts.node_version
          })
        });

        k.stdout.pipe(pt(chalk.blueBright('[r2g/docker] '))).pipe(process.stdout);
        k.stderr.pipe(pt(chalk.magenta('[r2g/docker] '))).pipe(process.stderr);

        // k.stdin.end(`./.r2g/exec.sh`);
        k.stdin.end();
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
