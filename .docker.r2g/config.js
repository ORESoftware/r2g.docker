const path = require('path');


if(!path.isAbsolute(process.env.MY_DOCKER_R2G_SEARCH_ROOT || '')){
  throw new Error('Please set the env var MY_DOCKER_R2G_SEARCH_ROOT to an absolute path.');
}

exports.default = {


  searchRoot: path.resolve(process.env.MY_DOCKER_R2G_SEARCH_ROOT),
  // searchRoot: path.resolve(process.env.HOME + '/WebstormProjects/oresoftware'),

  // the following packages will be installed in the Docker container using this pattern:

  // npm install /r2g_shared_dir/Users/you/

  packages: {

    // absolute local path (perhaps, if you have two projects with the same package.json name on your disk)
    // example1: "/absolute/path/to/project/root",
    //
    // // it's truthy non-string it will be discovered on your disk
    // example2: true,
    //
    // // if it's falsy it will be ignored
    // '@org/example3': 0

    residence: true,
    // r2g: false

  }

};
