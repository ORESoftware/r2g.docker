'use strict';

import cp = require('child_process');
import path = require("path");
import fs = require('fs');
import async = require('async');
import log from "../../logger";
import chalk from "chalk";
import shortid = require("shortid");

/////////////////////////////////////////////////////////////////

export const installDeps = (createProjectMap: any, dependenciesToInstall: Array<string>, opts: any, cb: any) => {

  const finalMap = {} as any;

  if (dependenciesToInstall.length < 1) {
    return process.nextTick(cb, null, finalMap);
  }

  async.eachLimit(dependenciesToInstall, 3,  (dep, cb) => {

      if (!createProjectMap[dep]) {
        log.info('dependency is not in the local map:', dep);
        return process.nextTick(cb, null);
      }

      const d = createProjectMap[dep];
      const c = path.dirname(d);

      const k = cp.spawn('bash');
      const id = shortid.generate();
      const dest = path.resolve(`${process.env.HOME}/.docker_r2g_cache/${id}`);
      const basename = path.basename(c);
      const depRoot = path.resolve(dest + '/' + basename);

      const pack =  (depRoot: string, cb: any) => {

        if (!opts.pack) {
          // the map just points to the root of the project
          finalMap[dep] = depRoot;
          return process.nextTick(cb);
        }

        const k = cp.spawn('bash');

        const cmd = [
          `cd ${depRoot}`,
          `npm pack --loglevel=warn`,
        ]
          .join('; ');

        log.info(`Now running: '${chalk.cyan.bold(cmd)}', in this directory: "${depRoot}".`);

        let stdout = '';

        k.stdout.on('data', function (d) {
          stdout += String(d).trim();
        });
        k.stdin.end(cmd + '\n');
        k.stderr.pipe(process.stderr);
        k.once('exit', function (code) {

          if (code > 0) {
            return cb(new Error('"npm pack" command exited with code greater than 0.'));
          }

          // the map points to the .tgz file in the root of the project, where stdout should be the .tgz file name
          finalMap[dep] = path.resolve(dest + '/' + basename + '/' + stdout);
          cb(null);

        });
      };

      const cmd = [
        `set -e`,
        `mkdir -p "${dest}"`,
        `rsync -r --exclude=".git" --exclude="node_modules" "${c}" "${dest}"`,
        // `npm install --loglevel=warn "${dest}/${basename}";`
      ]
        .join('; ');

      log.info(`Now running: '${chalk.cyan.bold(cmd)}'`);

      k.stdin.end(cmd);
      k.stderr.pipe(process.stderr);

      k.once('exit', function (code) {

        if (code < 1) {
          return pack(depRoot, cb);
        }

        log.error('The following command failed:');
        log.error(chalk.magentaBright.bold(cmd));
        cb(new Error(`The following command '${cmd}', exited with code: "${code}".`))

      });

    },

    function (err) {
      process.nextTick(cb, err, finalMap);
    });

};
