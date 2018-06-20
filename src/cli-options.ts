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
    help: 'Print help menu and exit.'
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
    names: ['root'],
    type: 'bool',
    help: 'Run the Docker container as the root user.'
  },
  {
    names: ['full'],
    type: 'bool',
    help: 'Install local copies of dependencies (very useful).'
  },
  {
    names: ['pack'],
    type: 'bool',
    help: 'Run `npm pack` against all local dependencies before installing them.'
  },
  {
    names: ['forever'],
    type: 'bool',
    help: 'Keep docker container alive (so user can debug container, etc).'
  },
  {
    names: ['allow-unknown'],
    type: 'bool',
    help: 'Allow unknown/unrecognized options to be passed to the command line.'
  }

]
