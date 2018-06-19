#!/usr/bin/env bash

set -e;

if [ ! -f package.json ]; then
  echo "there is no package.json file in your PWD." >&2;
  false; // since there is no package.json file, probably should abort here
fi


map="$docker_r2g_fs_map"
search_root="$docker_r2g_search_root"
shared="$docker_r2g_shared_dir";
name="$docker_r2g_package_name"  # your project's package.json name field


container="docker_r2g_$name";
docker stop "$container" || echo "no container with name $container running."
docker rm "$container" || echo "no container with name $container could be removed."

tag="docker_r2g_image/$name";

zmx_gray='\033[1;30m'
zmx_magenta='\033[1;35m'
zmx_cyan='\033[1;36m'
zmx_orange='\033[1;33m'
zmx_yellow='\033[1;33m'
zmx_green='\033[1;32m'
zmx_no_color='\033[0m'

zmx(){
    local v1="$1"; local v2="$2"; "$@"  \
    2> >( while read line; do echo -e "${zmx_magenta}[${v1} ${v2}] ${zmx_no_color} $line"; done ) \
    1> >( while read line; do echo -e "${zmx_gray}[${v1} ${v2}] ${zmx_no_color} $line"; done )
}


docker build -f Dockerfile.r2g -t "$tag" --build-arg CACHEBUST="$(date +%s)" .

#docker run \
#    -v "$search_root:$shared:ro"  \
#    -e docker_r2g_fs_map="$map" \
#    -e dkr2g_run_args=${run_args} \
#    -e MY_DOCKER_R2G_SEARCH_ROOT="/dev/null" \
#    --name "$container" "$tag"


docker run \
    -v "$search_root:$shared:ro"  \
    -e docker_r2g_fs_map="$map" \
    -e MY_DOCKER_R2G_SEARCH_ROOT="/dev/null" \
    --entrypoint "dkr2g" \
    --name "$container" "$tag" \
      run --allow-unknown $@



## to debug:
# docker run -it be12509dc3f2 /bin/bash
