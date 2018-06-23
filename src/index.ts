'use strict';

import ProcessEnv = NodeJS.ProcessEnv;

// export interface MyProcessEnv extends ProcessEnv {
//   r2g_container_id: string,
//   docker_r2g_is_debug: string
// }

declare global {

  // declare namespace NodeJS {
  //   export interface EnvironmentVariables {
  //     r2g_container_id: string,
  //     docker_r2g_is_debug: string
  //   }
  // }

  namespace NodeJS {

    export interface ProcessEnv  {
      [key:string]: string,
      r2g_container_id: string,
      docker_r2g_is_debug: string,
      docker_r2g_fs_map: string
      HOME: string
    }
    
    // export interface Global {
    //    process: {
    //      env: MyProcessEnv
    //    }
    // }
  }

}
//
// declare var process : {
//   env: {
//           r2g_container_id: string,
//       docker_r2g_is_debug: string
//   }
// };

export type ErrorValueCallback = (err: any, val: any) => void;

export const r2gSmokeTest = function () {
  return true;
};
