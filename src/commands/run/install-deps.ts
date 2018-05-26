import cp = require('child_process');
import path = require("path");
import fs = require('fs');
import async = require('async');
import log from "../../logger";
import uuid = require('uuid');
import chalk from "chalk";

/////////////////////////////////////////////////////////////////

export const installDeps = function (createProjectMap: any, dependenciesToInstall: Array<string>, cb :any) {
  
  async.eachSeries(dependenciesToInstall, function (dep, cb) {
      
      if (!createProjectMap[dep]) {
        log.info('dependency is not in the local map:', dep);
        return process.nextTick(cb);
      }
      
      const c = path.dirname(createProjectMap[dep]);
      
      const k = cp.spawn('bash');
      const id = uuid.v4();
      const dest = `$HOME/.docker_r2g_cache/${id}`;
      
      const cmd = [
        `set -e`,
        `mkdir -p "${dest}"`,
        `cp -R "${c}"/* "${dest}"`,
        `npm install --loglevel=warn "${dest}"`
      ]
      .join('; ');
      
      log.info(`About to run the following command: '${chalk.cyan(cmd)}'...`);
      k.stdin.end(cmd + '\n');
      k.stderr.pipe(process.stderr);
      k.once('exit', function (code) {
        
        if (code < 1) {
          return cb(null);
        }
        
        log.error('The following command failed:');
        log.error(cmd);
        cb(new Error(`Command with signature '${cmd}' exitted with code "${code}".`))
        
      });
      
    },
    
    cb);
};
