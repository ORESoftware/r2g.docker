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
    names: ['verbose', 'v'],
    type: 'arrayOfBool',
    help: 'Verbose output. Use multiple times for more verbose.'
  },
  {
    names: ['init',],
    type: 'bool',
    help: 'Initialize docker.r2g in your project',
    helpArg: 'FILE'
  },
  {
    names: ['run',],
    type: 'bool',
    help: 'Run docker.r2g against your project',
    helpArg: 'FILE'
  },
  {
    names: ['exec',],
    type: 'bool',
    help: 'Run docker.r2g against your project',
    helpArg: 'FILE'
  },
  {
    names: ['file', 'f'],
    type: 'string',
    help: 'File to process',
    helpArg: 'FILE'
  }

]
