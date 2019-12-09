import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';

import { createSiteID } from '../util';
import { SiteDBTable } from '../types';

const sites = (db: Database) => (req: Request, res: Response) => {
  const { name, source, domain, output_dir, build_command } = req.body;

  const insert = db.prepare(`
    INSERT INTO sites (
      id, 
      name,
      source,
      domain,
      output_dir,
      build_command
    ) VALUES (
      @id, 
      @name,
      @source,
      @domain,
      @output_dir,
      @build_command
    );
  `);

  const insertSite = db.transaction((site: SiteDBTable) => insert.run(site));
  const siteID = createSiteID();

  // ToDo Error handling
  try {
    insertSite({
      id: siteID,
      name,
      source,
      domain,
      output_dir,
      build_command,
    });
  } catch (error) {
    res.status(500).json({ error });
  }

  res.status(200).json({ siteCreated: siteID });
};

export default sites;
