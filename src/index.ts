'use strict';

import ProcessEnv = NodeJS.ProcessEnv;

declare global {
  namespace NodeJS {
    export interface ProcessEnv  {
      [key:string]: string,
      r2g_container_id: string,
      docker_r2g_is_debug: string,
      docker_r2g_fs_map: string
      HOME: string
    }
  }
}


export type ErrorValueCallback = (err: any, val: any) => void;

export const r2gSmokeTest = function () {
  return true;
};
