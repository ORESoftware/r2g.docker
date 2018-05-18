'use strict';

import path = require("path");
import fs = require('fs');
import async = require('async');
import log from "../../logger";

/////////////////////////////////////////////////////////////////////

export const getFSMap = function (cb: Function) {
  
  const map = {} as { [key: string]: string };
  
  const searchDir = function (dir: string, cb: any) {
    
    fs.readdir(dir, function (err, items) {
      
      if (err) {
        return cb(err);
      }
      
      const mappy = function (item: string, cb: Function) {
        
        item = path.resolve(dir + '/' + item);
        
        fs.stat(item, function (err, stats) {
          
          if (err) {
            log.warn(err.message);
            return cb(null);
          }
          
          if (stats.isDirectory()) {
            
            if(item.endsWith('/.npm')){
              return cb(null);
            }
  
            if(item.endsWith('/.cache')){
              return cb(null);
            }
  
            if(item.endsWith('/node_modules')){
              return cb(null);
            }
  
            if(item.endsWith('/node_modules/')){
              return cb(null);
            }
            
            if(item.endsWith('/.nvm')){
              return cb(null);
            }
            
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
                  log.error(err.message);
                  return cb(err);
                }
                
              });
            }
            
          }
          
          cb(null);
          
        });
        
      };
      
      async.eachLimit(
        items,
        4,
        mappy,
        cb
      );
      
    });
    
  };
  
  searchDir('/r2g_shared_dir', function (err: any) {
    cb(err, map);
  });
  
};
