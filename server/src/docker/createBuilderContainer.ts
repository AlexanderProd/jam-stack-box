import { Container } from 'dockerode';

import { docker } from '..';
import constants from '../config';

const createBuilderContainer = (env: {
  [key: string]: string;
}): Promise<Container> => {
  const envStrings: Array<string> = [];

  for (const key in env) {
    envStrings.push(`${key}=${env[key]}`);
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
