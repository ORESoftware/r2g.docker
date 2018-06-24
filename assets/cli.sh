#!/usr/bin/env bash

export r2g_is_docker="yes";

dir_name="$(dirname "$0")"
read_link="$(readlink "$0")";
exec_dir="$(dirname $(dirname "$read_link"))";
my_path="$dir_name/$exec_dir";
basic_path="$(cd $(dirname ${my_path}) && pwd)/$(basename ${my_path})"
commands="$basic_path/dist/commands"

cmd="$1";
shift 1;


if [ "$cmd" == "init" ]; then

  if [ -z "$(which docker)" ]; then
     echo >&2 "docker does not appear to be installed on your system (the docker executable cannot be found using 'which').";
  fi

  node "$commands/init" $@

elif [ "$cmd" == "exec" ]; then

  if [ -z "$(which docker)" ]; then
    echo >&2 "docker does not appear to be installed on your system (the docker executable cannot be found using 'which').";
  fi

  node "$commands/exec" $@

elif [ "$cmd" == "run" ]; then

  node "$commands/run" $@

else

  echo "error: no dkr2g subcommand was recognized. Exiting with code 1."
  exit 1;

fi
