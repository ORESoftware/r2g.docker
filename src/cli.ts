#!/usr/bin/env node
'use strict';

import cp = require('child_process');
import path = require("path");
import async = require('async');

const contents = path.resolve(__dirname + '/../assets/contents');
const cwd = process.cwd();

const docker_r2g = '.docker.r2g';

async.autoInject({
  
  mkdir: function () {
    const k = cp.spawn('bash');
    k.stdin.end(`mkdir ./${docker_r2g}`);
  },
  
  copyContents: function () {
    const k = cp.spawn('bash');
    k.stdin.end(`cp -R ${contents} ${cwd}/${docker_r2g}`);
  }


}, function (err,results) {
   if (err) throw err;
   
   
});




