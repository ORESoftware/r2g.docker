import cp = require('child_process');
import path = require("path");
import fs = require('fs');
import async = require('async');
import log from "../../logger";
import uuid = require('uuid');
import chalk from "chalk";

/////////////////////////////////////////////////////////////////

export const installDeps = function (createProjectMap: any, dependenciesToInstall: Array<string>, cb: any) {
  
  const finalMap = {} as any;
  
  async.eachSeries(dependenciesToInstall, function (dep, cb) {
      
      if (!createProjectMap[dep]) {
        log.info('dependency is not in the local map:', dep);
        return process.nextTick(cb);
      }
      
      const d = createProjectMap[dep];
      const c = path.dirname(d);
      
      const k = cp.spawn('bash');
      const id = uuid.v4();
      const dest = path.resolve(`${process.env.HOME}/.docker_r2g_cache/${id}`);
      finalMap[dep] = dest;
      
      const cmd = [
        `set -e`,
        `mkdir -p "${dest}"`,
        `rsync -r --exclude="node_modules" "${c}"/* "${dest}"`,
        `npm install --loglevel=warn "${dest}";`
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
    
    function (err) {
      cb(err, finalMap);
    });
};
