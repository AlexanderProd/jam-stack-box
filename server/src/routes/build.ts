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
    SITE_ID: site.id ? site.id : 'undefined',
    REPO_URL: site.source ? site.source : 'undefined',
    BUILD_COMMAND: site.buildCommand ? site.buildCommand : 'undefined',
    REMOTE_DEPLOY: site.remoteDeploy ? site.remoteDeploy : 'undefined',
    LOCAL_DEPLOY_PATH: site.localDeployPath
      ? site.localDeployPath
      : join(SITES_DIR, site.name),
    REMOTE_DEPLOY_PATH: site.remoteDeployPath
      ? site.remoteDeployPath
      : 'undefined',
    SSH_HOST: site.sshHost ? site.sshHost : 'undefined',
    SSH_PORT: site.sshPort ? site.sshPort : 'undefined',
    SSH_USERNAME: site.sshUsername ? site.sshUsername : 'undefined',
    SSH_PASSWORD: site.sshPassword ? site.sshPassword : 'undefined',
    SSH_KEYFILE_PATH: site.sshKeyfilePath ? site.sshKeyfilePath : 'undefined',
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
