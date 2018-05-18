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
import {getFSMap} from './get-fs-map';
import {installDeps} from './install-deps';

///////////////////////////////////////////////

export const run = function (cwd: string, projectRoot: string) {
  
  let pkgJSON = null, docker2gConf = null, packages = null;
  
  try {
    pkgJSON = require(projectRoot + '/package.json');
  }
  catch (err) {
    log.error('Could not read your projects package.json file.');
    throw getCleanTrace(err);
  }
  
  const deps = Object.assign(
    {},
    pkgJSON.dependencies,
    pkgJSON.devDependencies,
    pkgJSON.optionalDependencies
  );
  
  try {
    docker2gConf = require(projectRoot + '/.docker.r2g/config.js');
    packages = docker2gConf.packages;
  }
  catch (err) {
    log.error('Could not read your .docker.r2g/config.js file.');
    throw getCleanTrace(err);
  }
  
  const dependenciesToInstall = Object.keys(packages || {});
  
  if (dependenciesToInstall.length < 1) {
    log.error('You must supply some packages to link, otherwise this is somewhat pointless.')
  }
  
  async.autoInject({
      
      createProjectMap: function (cb: any) {
        getFSMap(cb);
      },
      
      installProjectsInMap: function (createProjectMap: any, cb: any) {
        installDeps(dependenciesToInstall, createProjectMap, cb);
      },
      
      renamePackagesToAbsolute: function (installProjectsInMap: any, cb: any) {
      
      },
      
      runLocalTests: function () {
      
      },
      
      r2g: function () {
      
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

