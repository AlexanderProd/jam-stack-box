import { Request, Response } from 'express';
import { fork } from 'child_process';

import constants from '../config';
import { getFromDB } from '../util';
import BuildProcesses from '../BuildProcesses';
import { SiteObject } from '../@types';

const build = async (req: Request, res: Response) => {
  const { id } = req.params;
  let site: SiteObject;

  if (!id) {
    return res.status(404).json({ error: 'No siteID provided!' });
  }

  try {
    site = await getFromDB(id);
  } catch (error) {
    return res.status(500).json({ error });
  }

  if (!site) {
    return res.status(404).json({ error: 'Site not found!' });
  }
  res.sendStatus(200);

  // Check if theres already one build process for this site running.
  if (BuildProcesses.get()[id] !== undefined) {
    const process = BuildProcesses.get()[id];
    process.send('stop');
    process.disconnect();
  }

  const builder = fork(__dirname + constants.BUILDER_PATH, [id, site.source], {
    silent: false,
  });

  BuildProcesses.set({ [id]: builder });

  builder.on('exit', () => {
    BuildProcesses.del(id);
  });
};

export default build;
