import express, { response } from 'express';
import bodyParser from 'body-parser';
import { mkdirSync, existsSync } from 'fs';

import createSite from './routes/createSite';
import getSite from './routes/getSite';
import build from './routes/build';
import builds from './routes/builds';
import constants from './config';
import BuildProcesses from './BuildProcesses';

const { DB_FOLDER, PORT, FRONTEND_DIR } = constants;
const app = express();

const init = () => {
  if (existsSync(DB_FOLDER)) return;
  mkdirSync(DB_FOLDER);
};

const main = () => {
  init();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/', express.static(__dirname + FRONTEND_DIR));

  app.post('/site', createSite);
  app.get('/site/:id', getSite);
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
