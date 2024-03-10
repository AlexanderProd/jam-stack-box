import { Container, HostConfig } from 'dockerode';

import { docker } from '..';
import constants from '../config';
import { BuildEnvVars } from '../types';

const createBuilderContainer = (
  env: BuildEnvVars,
  hostConfig?: HostConfig
): Promise<Container> => {
  const envStrings: Array<string> = [];

  for (const [key, value] of Object.entries(env)) {
    envStrings.push(`${key}=${value}`);
  }

  return new Promise(async (resolve, reject) => {
    try {
      const container = await docker.createContainer({
        Image: constants.BUILDER_IMAGE_TAG,
        Env: envStrings,
        Volumes: {
          '/sites-public': {},
          '/build-cache': {},
        },
        HostConfig: {
          ...hostConfig,
          Binds: [
            `${constants.SITES_DIR}:/sites-public`,
            `${constants.BUILD_CACHE_DIR}:/build-cache`,
          ],
          AutoRemove: false,
        },
      });

      resolve(container);
    } catch (error) {
      reject(error);
    }
  });
};

export default createBuilderContainer;
