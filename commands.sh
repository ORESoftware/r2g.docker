#!/usr/bin/env bash


docker_r2g_get_source(){
  . "./commands.sh";
}

docker_r2g_init(){
 docker_r2g --init
}


docker_r2g_exec(){
  ./.docker.r2g/exec.sh;
}


docker_r2g_run(){
 docker_r2g --run
}
