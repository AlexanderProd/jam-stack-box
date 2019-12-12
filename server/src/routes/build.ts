import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';
import { fork } from 'child_process';

import constants from '../config';
import BuildProcesses from '../BuildProcesses';

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

  if (BuildProcesses.get()[id] !== undefined) {
    const process = BuildProcesses.get()[id];
    process.send('stop');
  }

  const builder = fork(__dirname + constants.BUILDER_PATH, [id, site.source], {
    silent: false,
  });

  BuildProcesses.set({ [id]: builder });

  builder.on('message', msg => {
    console.log(msg);
    if (msg === 'sucess') {
      BuildProcesses.del(id);
    }
  });

  //ToDo remove process from BuildProcesses after finishing.
};

export default build;
