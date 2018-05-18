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
import {renameDeps} from './rename-file-deps';
import * as util from "util";

///////////////////////////////////////////////

export const run = function (cwd: string, projectRoot: string) {
  
  let pkgJSON = null, docker2gConf = null, packages = null;
  
  const pkgJSONPth = path.resolve(projectRoot + '/package.json');
  
  try {
    pkgJSON = require(pkgJSONPth);
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
    docker2gConf = docker2gConf.default || docker2gConf;
    packages = docker2gConf.packages;
  }
  catch (err) {
    log.error('Could not read your .docker.r2g/config.js file.');
    throw getCleanTrace(err);
  }
  
  const dependenciesToInstall = Object.keys(packages || {});
  if (dependenciesToInstall.length < 1) {
    log.error('You must supply some packages to link, otherwise this is somewhat pointless.');
    log.error('here is your configuration: ', util.inspect(docker2gConf));
  }
  
  async.autoInject({
      
      createProjectMap: function (cb: any) {
        getFSMap(cb);
      },
      
      installProjectsInMap: function (createProjectMap: any, cb: any) {
        installDeps(createProjectMap, dependenciesToInstall, cb);
      },
      
      renamePackagesToAbsolute: function (createProjectMap: any, installProjectsInMap: any, cb: any) {
        renameDeps(createProjectMap, pkgJSONPth, cb);
      },
      
      runLocalTests: function (renamePackagesToAbsolute: any,cb: Function) {
        log.info('running local tests');
        process.nextTick(cb);
      },
      
      r2g: function (runLocalTests: any, cb: Function) {
        log.info('running r2g tests');
        process.nextTick(cb);
      }
      
    },
    
    function (err, results) {
      
      if (err && err.OK === true) {
        log.info('Successfully run this baby.')
      }
      else if (err) {
        throw getCleanTrace(err);
      }
      
      log.info('Successfully ran docker.r2g')
      
    });
  
};

