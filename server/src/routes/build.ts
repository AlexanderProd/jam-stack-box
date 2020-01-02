import { Request, Response } from 'express';
import { execFile } from 'child_process';
import { join } from 'path';

import constants from '../config';
import { getFromDB } from '../util';
import BuildProcesses from '../BuildProcesses';
import { SiteObject } from '../@types';

const { BUILDER_PATH, SITES_DIR } = constants;

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
    process.kill();
  }

  const buildProperties = {
    SITE_ID: site.id,
    REPO_URL: site.source,
    DEPLOY_DIR: join(SITES_DIR, site.id),
    BUILD_COMMAND: site.buildCommand,
  };

  const builder = execFile(join(BUILDER_PATH, 'build.sh'), {
    cwd: BUILDER_PATH,
    env: buildProperties,
  });

  BuildProcesses.set({ [id]: builder });

  builder.stdout.setEncoding('utf8');
  builder.stdout.on('data', data => console.log(data.toString()));

  builder.stderr.setEncoding('utf8');
  builder.stderr.on('data', data => console.log(data.toString()));

  builder.on('close', code => {
    console.log('Builder closed with code:', code);
    BuildProcesses.del(id);
  });
};

export default build;
