import { docker } from '..';

import constants from '../config';

const checkBuilderImage = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const dockerImages = await docker.listImages();
      dockerImages.forEach(image => {
        if (image.RepoTags[0].includes(constants.BUILDER_IMAGE_TAG)) {
          resolve(true);
        }
        resolve(false);
      });
      resolve(false);
    } catch (error) {
      reject(error);
    }
  });
};

export default checkBuilderImage;
