import { readFile, writeFile } from 'fs';
import { join } from 'path';

import constants from '../config';
import { SiteObject } from '../@types';

export const createSiteID = (): string => {
  return Math.random()
    .toString(36)
    .substring(2, 8);
};

export const saveToDB = (id: string, payload: SiteObject): Promise<void> => {
  const location = join(constants.DB_FOLDER, id);
  const data = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    writeFile(location, data, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export const getFromDB = (id: string): Promise<SiteObject> => {
  const location = join(constants.DB_FOLDER, id);

  return new Promise((resolve, reject) => {
    readFile(location, (err, data) => {
      if (err) {
        reject(err);
      } else if (!data) {
        reject(new Error('No site with id found!'));
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  });
};
