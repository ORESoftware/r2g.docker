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
      
      createProjectMap: function (cb: any) {
        
        const map = {} as { [key: string]: string };
        
        const searchDir = function (dir: string, cb: any) {
          
          fs.readdir(dir, function (err, items) {
            
            if (err) {
              return cb(err);
            }
            
            async.eachLimit(items, 3, function (item, cb) {
                
                item = path.resolve(dir + '/' + item);
                
                fs.stat(item, function (err, stats) {
                  
                  if (stats.isDirectory()) {
                    return searchDir(item, cb);
                  }
                  
                  if (stats.isFile()) {
                    if (item.endsWith('/package.json')) {
                      return fs.readFile(item, function (err, data) {
                        
                        if (err) {
                          return cb(err);
                        }
                        
                        let parsed = null;
                        
                        try {
                          parsed = JSON.parse(String(data));
                          if (parsed && parsed.name) {
                            if (map[parsed.name]) {
                              log.warn('package may exist in more than one place on your fs.');
                              log.warn('pre-existing place => ', map[parsed.name]);
                            }
                            map[parsed.name] = item;
                          }
                          return cb(null);
                        }
                        catch (err) {
                          log.error('trouble parsing package.json file at path => ', item);
                          console.error(err.message);
                          return cb(err);
                        }
                        
                      });
                    }
                    
                  }
                  
                  cb(null);
                  
                });
                
              },
              cb);
            
          });
          
        };
        
        searchDir('/r2g_shared_dir', function (err: any) {
          cb(err, map);
        });
        
      },
      
      installProjectsInMap: function (mkdir: any, cb: any) {
      
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
        log.info('Successfully initialized docker.r2g - looks like it was already initialized in this project.')
      }
      else if (err) {
        throw getCleanTrace(err);
      }
      
      log.info('Successfully initialized docker.r2g')
      
    });
  
};

