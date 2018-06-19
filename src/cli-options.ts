'use strict';

export default [

  {
    name: 'version',
    type: 'bool',
    help: 'Print tool version and exit.'
  },
  {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Print this help and exit.'
  },
  {
    names: ['verbosity', 'v'],
    type: 'integer',
    help: 'Verbosity level, 1-3 inclusive.'
  },
  {
    names: ['node-version', 'nodev', 'node.v'],
    type: 'string',
    help: 'The node version to use (the Docker image/container will use this node version).',
    default: "10"
  },
  {
    names: ['npm-version', 'npmv', 'npm.v'],
    type: 'string',
    help: 'The npm version to use (the Docker image/container will use this npm version).'
  },
  {
    names: ['pack'],
    type: 'bool',
    help: 'Run `npm pack` against all local dependencies before installing them.'
  },
  {
    names: ['forever'],
    type: 'bool',
    help: 'Run `npm pack` against all local dependencies before installing them.'
  },
  {
    names: ['allow-unknown'],
    type: 'bool',
    help: 'Allow unknown/unrecognized options to be passed to the command line.'
  }

]
