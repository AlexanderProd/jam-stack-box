import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';
import { fork } from 'child_process';

import constants from '../config';

const build = (db: Database) => (req: Request, res: Response) => {
  const { id } = req.params;

  const stmt = db.prepare(`
    SELECT name, source, domain
    FROM sites 
    WHERE id = ?
  `);

  const site = stmt.get(id);

  if (site === undefined) {
    res.status(404).json({ error: 'Site not found!' });
  }
  res.sendStatus(200);

  const builder = fork(__dirname + constants.BUILDER_PATH, [id, site.source], {
    silent: true,
  });

  builder.on('message', msg => {
    console.log(msg);
  });
};

export default build;
