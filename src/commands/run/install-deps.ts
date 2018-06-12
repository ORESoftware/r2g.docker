'use strict';

import cp = require('child_process');
import path = require("path");
import fs = require('fs');
import async = require('async');
import log from "../../logger";
import chalk from "chalk";
import shortid = require("shortid");

/////////////////////////////////////////////////////////////////

export const installDeps = function (createProjectMap: any, dependenciesToInstall: Array<string>, cb: any) {

  const finalMap = {} as any;

  async.mapLimit(dependenciesToInstall, 3, function (dep, cb) {

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
      finalMap[dep] = path.resolve(dest + '/' + basename);

      const cmd = [
        `set -e`,
        `mkdir -p "${dest}"`,
        `rsync -r --exclude="node_modules" "${c}" "${dest}"`,
        // `npm install --loglevel=warn "${dest}/${basename}";`
      ]
      .join('; ');

      log.info(`About to run the following command: '${chalk.cyan.bold(cmd)}'`);

      k.stdin.end(cmd + '\n');
      k.stderr.pipe(process.stderr);

      k.once('exit', function (code) {

        if (code < 1) {
          return cb(null, {
            dest,
            basename
          });
        }

        log.error('The following command failed:');
        log.error(chalk.magentaBright.bold(cmd));
        cb(new Error(`The following command '${cmd}', exited with code: "${code}".`))

      });

    },

    function (err, results: Array<any>) {

      if (err) {
        return cb(err);
      }

      const k = cp.spawn('bash');

      const getMap = function () {
        return results.filter(Boolean).map(function (v) {
          return `"${v.dest}/${v.basename}"`
        })
        .join(' ');
      };

      const cmd = `npm install --loglevel=warn ${getMap()} `;
      log.info('now running the following command:', chalk.green.bold(cmd));
      k.stdin.end(cmd);

      k.stderr.pipe(process.stderr);

      k.once('exit', function (code) {

        if (code < 1) {
          cb(null, finalMap);
        }
        else {
          cb(new Error('npm install process exitted with code greater than 0.'));
        }

      });

    });
};
