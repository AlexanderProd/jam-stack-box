import express from 'express';
import bodyParser from 'body-parser';
import Database from 'better-sqlite3';

import createSite from './routes/createSite';
import getSite from './routes/getSite';
import build from './routes/build';
import builds from './routes/builds';
import constants from './config';

const { DB_FOLDER, PORT, FRONTEND_DIR } = constants;
const app = express();
const db = new Database(DB_FOLDER);

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source TEXT,
      domain TEXT,
      output_dir TEXT,
      build_command TEXT
    );
  `);
};

const main = () => {
  initDB();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/', express.static(__dirname + FRONTEND_DIR));

  app.post('/site', createSite(db));
  app.get('/site/:id', getSite(db));
  app.post('/build/:id', build(db));
  app.get('/builds', builds);

  app.listen(PORT, () => console.log('App listening on port 3000!'));
};

main();
