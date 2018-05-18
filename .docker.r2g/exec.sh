#!/usr/bin/env bash

set -e;

if [ ! -f package.json ]; then
  echo "there is no package.json file in your PWD." >&2;
  false;
fi

#name="$(axxel package.json 'name')";

name="my_docker_r2g";

container="docker_r2g_-_$name";
docker stop "$container" || echo "no container with name $container running."
docker rm "$container" || echo "no container with name $container could be removed."

tag="docker_r2g_image/$name";
shared="r2g_shared_dir"

docker build -f Dockerfile.r2g -t "$tag" .
docker run -it -v "$HOME/WebstormProjects/oresoftware:/$shared:ro" --name "$container" "$tag"
