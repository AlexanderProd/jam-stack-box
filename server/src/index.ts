import express, { response } from 'express';
import bodyParser from 'body-parser';
import { mkdirSync, existsSync } from 'fs';

import createSite from './routes/createSite';
import getSite from './routes/getSite';
import delSite from './routes/delSite';
import build from './routes/build';
import builds from './routes/builds';
import constants from './config';
import BuildProcesses from './BuildProcesses';

const { DB_DIR, PORT, FRONTEND_DIR, SITES_DIR, BUILDER_PATH } = constants;
const app = express();

const init = () => {
  (() => {
    if (existsSync(DB_DIR)) return;
    mkdirSync(DB_DIR);
  })();
  (() => {
    if (existsSync(SITES_DIR)) return;
    mkdirSync(SITES_DIR);
  })();
};

const main = () => {
  init();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/', express.static(FRONTEND_DIR));

  app.post('/site', createSite);
  app.get('/sites/:id', getSite);
  app.get('/sites', getSite);
  app.delete('/site/:id', delSite);
  app.post('/build/:id', build);
  app.get('/builds', builds);

  app.listen(PORT, () => console.log('App listening on port 3000!'));

  // make sure build processes stop gracefully once node app stops.
  process.on('exit', code => {
    const runningBuilds = BuildProcesses.get();
    for (const key in runningBuilds) {
      runningBuilds[key].disconnect();
      runningBuilds[key].kill(code);
    }
    process.exit(0);
  });
};

main();
