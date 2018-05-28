'use strict';

import path = require("path");
import fs = require('fs');
import async = require('async');
import log from "../../logger";
import * as util from "util";
import chalk from "chalk";

/////////////////////////////////////////////////////////////////

export const renameDeps = function (projectMap: any, pkgJSONPath: string, cb: any) {
  
  log.info('here is the project map now:');
  
  Object.keys(projectMap).forEach(function(k){
    log.info(chalk.bold(k), chalk.blueBright(util.inspect(projectMap[k])));
  });
  
  async.autoInject({
    
    rereadPkgJSON: function (cb: Function) {
      
      fs.readFile(pkgJSONPath, function (err, data) {
        
        if (err) {
          return cb(err);
        }
        
        try {
          return cb(null, JSON.parse(String(data)));
        }
        catch (err) {
          return cb(err);
        }
        
      })
      
    },
    
    saveNewJSONFileToDisk: function (rereadPkgJSON: any, cb: Function) {
      
      const updateTheDepKV = function () {
        [
          rereadPkgJSON.dependencies,
          rereadPkgJSON.devDependencies,
          rereadPkgJSON.optionalDependencies
        
        ]
        .forEach(function (d) {
          
          d = d || {};
          
          Object.keys(d).forEach(function (k) {
            
            const v = d[k];
            
            if (v && projectMap[k]) {
              d[k] = 'file://' + projectMap[k];
            }
            else if (v && String(v).startsWith('file:')) {
              log.error('The following dep has a file:// key, but does not exist in generated map => ' + k);
              throw 'Please check your package.json file: ' + util.inspect(rereadPkgJSON);
            }
            
            // if (String(v).startsWith('file:')) {
            //
            //   if (projectMap[k]) {
            //     d[k] = 'file://' + path.dirname(projectMap[k]);
            //   }
            //   else {
            //     log.error('The following dep has a file:// key, but does not exist in generated map => ' + k);
            //     throw 'Please check your package.json file: ' + util.inspect(rereadPkgJSON)
            //   }
            //
            // }
            
          });
          
        });
      };
      
      let str = null;
      
      try {
        updateTheDepKV();
        str = JSON.stringify(rereadPkgJSON, null, 2);
        log.debug('New JSON file:', util.inspect(rereadPkgJSON));
      }
      catch (err) {
        return cb(err);
      }
      
      // save the json object back to disk
      fs.writeFile(pkgJSONPath, str, cb);
      
    }
    
  }, cb);
  
};
