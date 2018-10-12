#!/usr/bin/env bash

get_latest_dkr2g(){
  . "$HOME/.oresoftware/bash/dkr2g.sh";
}

dkr2g(){

 if ! type -f dkr2g &> /dev/null || ! which dkr2g &> /dev/null; then

       echo -e "Installing dkr2g/r2g.docker command line package from NPM..." >&2;

       npm i -s -g 'r2g.docker' || {
          echo -e "Could not install the 'r2g.docker' NPM package globally." >&2;
          echo -e "Check your user permissions to install global NPM packages." >&2;
          return 1;
      }
  fi

  command dkr2g "$@"
}


r2g_docker(){
    dkr2g
}

export -f dkr2g;
export -f r2g_docker;
export -f get_latest_dkr2g;

