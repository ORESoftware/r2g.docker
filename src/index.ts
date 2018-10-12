'use strict';

declare global {

  namespace NodeJS {

    export interface ProcessEnv {
      [key: string]: string,

      r2g_container_id: string,
      docker_r2g_is_debug: string,
      docker_r2g_fs_map: string
      HOME: string
    }

  }

}

export type EVCb<T = any, E = any> = (err: E, T?: any) => void;

export const r2gSmokeTest = function () {
  return true;
};
