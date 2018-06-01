#!/usr/bin/env bash


DIRN="$(dirname "$0")"
RL="$(readlink "$0")";
EXECDIR="$(dirname $(dirname "$RL"))";
MYPATH="$DIRN/$EXECDIR";
X="$(cd $(dirname ${MYPATH}) && pwd)/$(basename ${MYPATH})"
commands="$X/dist/commands"

cmd="$1";
shift 1;

if [ "$cmd" == "init" ]; then
  node "$commands/init" "$@"

elif [ "$cmd" == "exec" ]; then
  node "$commands/exec" "$@"

elif [ "$cmd" == "run" ]; then
  node "$commands/run" "$@"

else

  echo "error: no dkr2g subcommand was recognized. Exiting with code 1."
  exit 1;

fi
