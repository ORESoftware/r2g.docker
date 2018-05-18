import cp = require('child_process');
import path = require("path");
import fs = require('fs');
import async = require('async');
import log from "../../logger";

/////////////////////////////////////////////////////////////////

export const installDeps = function (createProjectMap: any, dependenciesToInstall: Array<string>, cb :any) {
  
  async.eachSeries(dependenciesToInstall, function (dep, cb) {
      
      if (!createProjectMap[dep]) {
        log.info('dependency is not in the local map:', dep);
        return process.nextTick(cb);
      }
      
      const c = createProjectMap[dep];
      
      const k = cp.spawn('bash');
      const cmd = `npm install ${c};\n`;
      k.stdin.end(cmd);
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
