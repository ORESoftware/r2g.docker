const path = require('path');

const {getFSMap} = require('../dist/commands/run/get-fs-map');

const ores = path.resolve(process.env.HOME + '/WebstormProjects');

getFSMap(ores, function (err, data) {
  if (err) throw err;
  console.log('here is the data:');
  console.log(data);
});
