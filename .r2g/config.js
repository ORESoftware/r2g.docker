'use strict';

const path = require('path');

if (!path.isAbsolute(process.env.MY_R2G_DOCKER_SEARCH_ROOT || '')) {
  throw new Error('Please set the env var MY_R2G_DOCKER_SEARCH_ROOT to an absolute path.');
}

exports.default = {

  searchRoot: path.resolve(process.env.MY_R2G_DOCKER_SEARCH_ROOT),
  
  // searchRoot: path.resolve(process.env.HOME + '/WebstormProjects/oresoftware'),
  // the following packages will be installed in the Docker container using this pattern:
  // npm install /r2g_shared_dir/Users/you/

  packages: {
    'residence': true,
    'prepend-transform': true,
    'clean-trace': true
  }

};
