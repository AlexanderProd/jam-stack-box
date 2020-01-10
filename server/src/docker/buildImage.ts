import { join } from 'path';

import { docker } from '..';
import constants from '../config';

const buildImage = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await docker.buildImage(
        {
          context: constants.BUILDER_PATH,
          src: ['Dockerfile', 'build.sh', 'build-functions.sh'],
        },
        {
          t: constants.BUILDER_IMAGE_TAG,
        }
      );

      stream.setEncoding('utf8');
      stream.pipe(process.stdout, { end: true });

      stream.on('end', () => {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default buildImage;
