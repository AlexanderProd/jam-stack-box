import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';

const getSite = (db: Database) => (req: Request, res: Response): void => {
  const { id } = req.params;

  const stmt = db.prepare(`
    SELECT *
    FROM sites 
    WHERE id = ?
  `);

  const site = stmt.get(id);

  if (site === undefined) {
    res.status(404).send('Site not found.');
  }

  res.send(site);
};

export default getSite;
