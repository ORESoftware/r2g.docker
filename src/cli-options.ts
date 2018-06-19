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
    names: ['pack'],
    type: 'bool',
    help: 'Run `npm pack` against all local dependencies before installing them.'
  },
  {
    names: ['allow-unknown'],
    type: 'bool',
    help: 'Allow unknown/unrecognized options to be passed to the command line.'
  }

]
