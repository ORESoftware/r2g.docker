'use strict';

import cp = require('child_process');
import path = require("path");
import fs = require('fs');
import async = require('async');
import {getCleanTrace} from 'clean-trace';

// project
const contents = path.resolve(__dirname + '/../../../assets/contents');
const Dockerfile = path.resolve(__dirname + '/../../../assets/contents/Dockerfile.r2g.original');
const docker_r2g = '.docker.r2g';
import log from '../../logger';

///////////////////////////////////////////////

export const run = function (cwd: string, projectRoot: string) {
  
  const dockerfileDest = path.resolve(projectRoot + '/Dockerfile.r2g');
  
  async.autoInject({
      
      mkdir: function (cb: any) {
        const k = cp.spawn('bash');
        k.stdin.end(`mkdir ./${docker_r2g}`);
        k.once('exit', function (code) {
          code > 0 ? cb({OK: true}) : cb(null);
        });
      },
      
      copyContents: function (mkdir: any, cb: any) {
        const k = cp.spawn('bash');
        k.stdin.end(`cp -R ${contents}/* ${cwd}/${docker_r2g}`);
        k.once('exit', cb);
      },
      
      createDockerfile: function (mkdir: any, cb: any) {
        fs.createReadStream(Dockerfile)
        .pipe(fs.createWriteStream(dockerfileDest))
        .once('error', cb)
        .once('end', cb);
      }
      
    },
    
    function (err, results) {
      
      if (err && err.OK === true) {
        log.info('looks like it was already initialized in this project.')
      }
      else if (err) {
        throw getCleanTrace(err);
      }
      
      log.info('Successfully initialized docker.r2g')
      
    });
  
};

