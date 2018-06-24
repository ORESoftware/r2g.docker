#!/usr/bin/env bash

get_latest_dkr2g(){
  . "$HOME/.oresoftware/bash/dkr2g.sh";
}

dkr2g(){

 if ! type -f dkr2g &> /dev/null || ! which dkr2g &> /dev/null; then

       echo -e "Installing dkr2g command line package from NPM..." >&2;

       npm i -s -g '@oresoftware/docker.r2g'  || {

          echo -e "Could not install the '@oresoftware/r2g' NPM package globally." >&2;
          echo -e "Check your user permissions to install global NPM packages." >&2;
          return 1;

      }
  fi

  command dkr2g $@
}


export -f dkr2g;

