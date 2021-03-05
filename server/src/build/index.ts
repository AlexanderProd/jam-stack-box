import { exec } from 'child_process';
import { join } from 'path';

import BuildProcesses from '../BuildProcesses';
import { createBuilderContainer } from '../docker';
import { BuildEnvVars } from '../types';
import { saveBuildLog } from '../util';
import { Site, Event } from '../sql';
import { docker } from '..';

const startBuild = async (site: Site) => {
  const { id } = site;
  const buildEnvVars: BuildEnvVars = {
    SITE_ID: site.id ? site.id : 'undefined',
    REPO_URL: site.source ? site.source : 'undefined',
    BUILD_COMMAND: site.buildCommand ? site.buildCommand : 'undefined',
    NODE_VERSION: site.nodeVersion ? site.nodeVersion : 'undefined',
    BUILD_DIR: site.buildDir ? site.buildDir : 'public',
    DEPLOY_DIR: join('/sites-public/', site.name),
    GITHUB_ACCESS_TOKEN: site.githubAccessToken
      ? site.githubAccessToken
      : 'undefined',
  };

  let event: Event;

  /**
   * Check if theres already one build process for this site running.
   * If the active build process is in prepare stage return
   * otherwise stop running build and start a new one.
   */
  if (BuildProcesses.get()[id] !== undefined) {
    const runningBuild = BuildProcesses.get()[id];

    if (runningBuild.status === 'preparing') {
      return;
    }

    BuildProcesses.set({
      [id]: { ...runningBuild, status: 'preparing' },
    });
    event = await site.$create('event', {
      siteId: site.id,
      status: 'preparing',
    });

    try {
      const container = docker.getContainer(runningBuild.container.id);
      await container.stop();
      await runningBuild.event.update({ status: 'stopped' });
      BuildProcesses.del(id);
    } catch (error) {
      console.error(error);
    }
  } else {
    event = await site.$create('event', {
      siteId: site.id,
      status: 'preparing',
    });
  }

  try {
    const container = await createBuilderContainer(
      buildEnvVars,
      site.containerHostConfig
    );
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
      tty: true,
    });

    BuildProcesses.set({ [id]: { status: 'building', container, event } });
    await event.update({ status: 'building' });

    saveBuildLog(event, stream);

    stream.on('end', async () => {
      BuildProcesses.del(id);
      const {
        State: { ExitCode },
      } = await container.inspect();

      if (ExitCode === 0) {
        event.update({
          status: 'success',
        });

        if (site.postBuildCommand) {
          exec(site.postBuildCommand);
        }

        container.remove();
      } else {
        if (event.status !== 'stopped')
          event.update({
            status: 'failed',
          });

        container.remove();
      }
    });
    stream.on('error', code => {
      const errorMessage = `Container returned error code ${code}`;

      console.log(errorMessage);
      BuildProcesses.del(id);
      event.update({ status: 'failed', description: errorMessage });

      container.remove();
    });

    container.start();
  } catch (error) {
    console.error(error);
  }
};

export default startBuild;
