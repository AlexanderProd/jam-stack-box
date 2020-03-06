import express from 'express';
import bodyParser from 'body-parser';
import Docker from 'dockerode';
import { existsSync, mkdirSync } from 'fs';

import createSite from './routes/createSite';
import getSite from './routes/getSite';
import delSite from './routes/delSite';
import build from './routes/build';
import builds from './routes/builds';
import events from './routes/events';
import constants from './config';
import BuildProcesses from './BuildProcesses';
import { checkBuilderImage, buildImage } from './docker';

const { PORT, FRONTEND_DIR, DB_DIR, SITES_DIR } = constants;

const app = express();
export const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const main = async () => {
  try {
    const isAvailable = await checkBuilderImage();

    if (!isAvailable) {
      await buildImage();
    }

    if (!existsSync(DB_DIR)) {
      mkdirSync(DB_DIR);
    }

    if (!existsSync(SITES_DIR)) {
      mkdirSync(SITES_DIR);
    }
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
  app.get('/events', events);

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
