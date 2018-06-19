#!/usr/bin/env bash


dir_name="$(dirname "$0")"
read_link="$(readlink "$0")";
exec_dir="$(dirname $(dirname "$read_link"))";
my_path="$dir_name/$exec_dir";
basic_path="$(cd $(dirname ${my_path}) && pwd)/$(basename ${my_path})"
commands="$basic_path/dist/commands"

cmd="$1";
shift 1;

#MY_ARGS=("$@")
#export dkr2g_run_args="${MY_ARGS[@]}";
#export dkr2g_run_args=("${MY_ARGS[@]}");


if [ "$cmd" == "init" ]; then
  node "$commands/init" $@

elif [ "$cmd" == "exec" ]; then
  node "$commands/exec" $@

elif [ "$cmd" == "run" ]; then
  node "$commands/run" $@

else

  echo "error: no dkr2g subcommand was recognized. Exiting with code 1."
  exit 1;

fi
