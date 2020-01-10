import { Request, Response } from 'express';
import { join } from 'path';

import { getFromDB } from '../util';
import BuildProcesses from '../BuildProcesses';
import { SiteObject } from '../@types';
import { docker } from '..';
import { createBuilderContainer } from '../docker';

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
  // If the active build process is in prepare stage return
  // otherwise stop running build and start a new one.
  if (BuildProcesses.get()[id] !== undefined) {
    const runningBuild = BuildProcesses.get()[id];

    if (runningBuild.status === 'prepare') {
      return;
    }

    BuildProcesses.set({
      [id]: { ...runningBuild, status: 'prepare' },
    });

    try {
      const container = docker.getContainer(runningBuild.container.id);
      await container.stop();
      BuildProcesses.del(id);
    } catch (error) {
      console.error(error);
    }
  }

  const buildProperties = {
    SITE_ID: site.id ? site.id : 'undefined',
    REPO_URL: site.source ? site.source : 'undefined',
    BUILD_COMMAND: site.buildCommand ? site.buildCommand : 'undefined',
    DEPLOY_DIR: join('/sites-public/', id),
  };

  try {
    const container = await createBuilderContainer(buildProperties);
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
      tty: true,
    });

    BuildProcesses.set({ [id]: { status: 'building', container } });
    stream.pipe(process.stdout);
    stream.on('end', () => {
      console.log('Container stopped');
      BuildProcesses.del(id);
    });
    container.start();
  } catch (error) {
    console.error(error);
  }
};

export default build;
