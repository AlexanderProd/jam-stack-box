import { readFile, readFileSync, writeFile, readdir, unlink } from 'fs';
import { join } from 'path';

import constants from '../config';
import { SiteObject } from '../@types';

const { DB_DIR } = constants;

export const createSiteID = (): string => {
  return Math.random()
    .toString(36)
    .substring(2, 8);
};

export const saveToDB = (id: string, payload: SiteObject): Promise<void> => {
  const location = join(DB_DIR, id);
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

export function getFromDB(): Promise<Array<SiteObject>>;
export function getFromDB(id: string): Promise<SiteObject>;
export function getFromDB(
  id?: string
): Promise<SiteObject> | Promise<Array<SiteObject>> {
  if (id) {
    const path = join(DB_DIR, id);

    return new Promise<SiteObject>((resolve, reject) => {
      readFile(path, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            reject('No site with id found!');
          } else {
            reject(err);
          }
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
    });
  } else {
    const objects: Array<SiteObject> = [];

    return new Promise<Array<SiteObject>>((resolve, reject) => {
      readdir(DB_DIR, (err, files) => {
        if (err) {
          reject(err);
        }
        files.map(file => {
          const filePath = join(DB_DIR, file);

          // ToDo use readFile to avoid blocking the event loop.
          const data = readFileSync(filePath);
          objects.push(JSON.parse(data.toString()));
        });
        resolve(objects);
      });
    });
  }
}

export const delFromDB = (id: string): Promise<void> => {
  const path = join(DB_DIR, id);

  return new Promise((resolve, reject) => {
    unlink(path, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
