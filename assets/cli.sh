#!/usr/bin/env bash

cmd="$1";
shift 1;

export r2g_is_docker="yes";

export zmx_gray='\033[1;30m'
export zmx_magenta='\033[1;35m'
export zmx_cyan='\033[1;36m'
export zmx_orange='\033[1;33m'
export zmx_yellow='\033[1;33m'
export zmx_green='\033[1;32m'
export zmx_no_color='\033[0m'

zmx(){
    local v1="$1"; local v2="$2"; "$@"  \
        2> >( while read line; do echo -e "${zmx_magenta}[${v1} ${v2}] ${zmx_no_color} $line"; done ) \
        1> >( while read line; do echo -e "${zmx_gray}[${v1} ${v2}] ${zmx_no_color} $line"; done )
}

export -f zmx;

dir_name="$(dirname "$0")"
read_link="$(readlink "$0")";
exec_dir="$(dirname $(dirname "$read_link"))";
my_path="$dir_name/$exec_dir";
basic_path="$(cd $(dirname ${my_path}) && pwd)/$(basename ${my_path})"
commands="$basic_path/dist/commands"


if [ "$cmd" == "init" ]; then

  if ! which docker; then
     echo >&2 "docker does not appear to be installed on your system (the docker executable cannot be found using 'which').";
  fi

  if ! type -f r2g; then
     npm i -g -s '@oresoftware/r2g' || {
       echo "Could not install r2g on your system as a global NPM package.";
       echo "Please check your permissions to install NPM packages globally.";
       exit 1;
     }
  fi

  r2g init "$@"


elif [ "$cmd" == "exec" ]; then

  if ! which docker; then
     echo >&2 "warning: docker does not appear to be installed on your system (the docker executable cannot be found using 'which').";
  fi


  node "$commands/exec" "$@"

elif [ "$cmd" == "run" ]; then

  node "$commands/run" "$@"

else

  echo "error: no dkr2g subcommand was recognized. Exiting with code 1."
  exit 1;

fi
