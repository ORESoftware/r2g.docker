#!/usr/bin/env bash



dkr2g(){

  if [[ -z $(command -v dkr2g) ]] || [[ -z $(which dkr2g) ]]; then
       npm install -g --silent '@oresoftware/docker.r2g'  || {
          echo -e "Could not install the '@oresoftware/r2g' NPM package globally." >&2;
          echo -e "Check your user permissions to install global NPM packages." >&2;
          return 1;
      }
  fi

  command dkr2g $@
}


export -f dkr2g;

