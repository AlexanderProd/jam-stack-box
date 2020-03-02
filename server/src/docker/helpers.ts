import { exec } from 'child_process';

import { docker } from '../';

/**
 * Returns own Docker container ID.
 */
export const getSelfCID = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec('cat /etc/hostname', (error, stdout) => {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
};

/**
 * Returns the path on the host machine for a given volume directory.
 * @param destination The path to the mounted volume inside the container: e.g. /db
 */
export const getHostMountPath = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const thisContainer = docker.getContainer(await getSelfCID());

      resolve(thisContainer.id);
      /* const { Mounts } = await thisContainer.inspect();

      Mounts.forEach(({ Destination, Source }) => {
        if (Destination === destination) {
          resolve(Source);
        }
      });
      reject(new Error(`No volume with destination ${destination} found`)); */
    } catch (error) {
      reject(error);
    }
  });
};
