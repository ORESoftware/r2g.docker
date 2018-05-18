exports.default = {
  
  searchRoot: process.env.HOME,
  
  // the following packages will be installed in the Docker container using this pattern:
  
  // npm install /r2g_shared_dir/Users/you/
  
  
  anyLocalPackage: true,
  
  packages: {
  
    // absolute local path (perhaps, if you have two projects with the same package.json name on your disk)
    example1: "/absolute/local/path/to/project/root",
    
    // it's truthy non-string it will be discovered on your disk
    example2: true,
    
    // if it's falsy it will be ignored
    '@org/example3': 0
    
  }
  
};
