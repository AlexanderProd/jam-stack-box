import { Container } from 'dockerode';

import { docker } from '..';
import constants from '../config';
import { BuildEnvVars } from '../@types';

const createBuilderContainer = (env: BuildEnvVars): Promise<Container> => {
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
        },
        HostConfig: {
          Binds: [`${constants.SITES_DIR}:/sites-public`],
          AutoRemove: true,
        },
      });

      resolve(container);
    } catch (error) {
      reject(error);
    }
  });
};

export default createBuilderContainer;
