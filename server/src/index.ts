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
import authenticate from './routes/authenticate';
import constants from './config';
import { checkBuilderImage, buildImage } from './docker';
import { withAuth } from './middlewares';
import { stopRunningBuilds } from './util';

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

  app.post('/site', withAuth, createSite);
  app.get('/sites/:id', getSite);
  app.get('/sites', getSite);
  app.delete('/site/:id', withAuth, delSite);
  app.post('/build/:id', build);
  app.get('/builds', builds);
  app.get('/events', events);
  app.post('/authenticate', authenticate);

  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

  // make sure build processes stop gracefully once node app stops.
  process.on('exit', code => {
    stopRunningBuilds(code);
    process.exit(code);
  });
};

main();
