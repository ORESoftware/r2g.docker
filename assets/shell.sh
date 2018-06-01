#!/usr/bin/env bash


docker.r2g(){
  dkr2g "$@"
}

docker_r2g(){
  dkr2g "$@"
}

dkr2g(){

  local which_dkr2g="$(command -v dkr2g)"

  if [ -z "$which_dkr2g" ]; then
       npm install -g --loglevel=warn "@oresoftware/docker.r2g"  || {
          return 1;
      }
  fi

  command dkr2g "$@"
}


export -f dkr2g;
