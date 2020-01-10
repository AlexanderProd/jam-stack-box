import express from 'express';
import bodyParser from 'body-parser';
import { mkdirSync, existsSync } from 'fs';
import Docker from 'dockerode';

import createSite from './routes/createSite';
import getSite from './routes/getSite';
import delSite from './routes/delSite';
import build from './routes/build';
import builds from './routes/builds';
import constants from './config';
import BuildProcesses from './BuildProcesses';
import { checkBuilderImage, buildImage } from './docker';

const { DB_DIR, PORT, FRONTEND_DIR, SITES_DIR } = constants;
const app = express();
export const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const init = (): Promise<void> => {
  (() => {
    if (existsSync(DB_DIR)) return;
    mkdirSync(DB_DIR);
  })();
  (() => {
    if (existsSync(SITES_DIR)) return;
    mkdirSync(SITES_DIR);
  })();

  return new Promise(async (resolve, reject) => {
    try {
      const isAvailable = await checkBuilderImage();

      if (isAvailable === false) {
        await buildImage();
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const main = async () => {
  try {
    await init();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/', express.static(FRONTEND_DIR));

  app.post('/site', createSite);
  app.get('/sites/:id', getSite);
  app.get('/sites', getSite);
  app.delete('/site/:id', delSite);
  app.post('/build/:id', build);
  app.get('/builds', builds);

  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

  // make sure build processes stop gracefully once node app stops.
  process.on('exit', code => {
    const runningBuilds = BuildProcesses.get();
    for (const id in runningBuilds) {
      if (runningBuilds[id].container !== undefined) {
        const container = docker.getContainer(runningBuilds[id].container.id);
        container.kill({ signal: code });
      }
    }
    process.exit(code);
  });
};

main();
