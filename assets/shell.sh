#!/usr/bin/env bash


docker.r2g(){
  dkr2g "$@"
}

docker_r2g(){
  dkr2g "$@"
}

dkr2g(){

  local whch="$(command -v dkr2g)"

  if [ -z "$whch" ]; then
       npm install -g --loglevel=warn "@oresoftware/docker.r2g"  || {
          return 1;
      }
  fi

  command dkr2g "$@"
}


export -f dkr2g;
export -f docker.r2g;
export -f docker_r2g;
