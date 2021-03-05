import { Container } from 'dockerode';

import { Event } from '../sql';

export interface BuildEnvVars {
  SITE_ID: string;
  REPO_URL: string;
  BUILD_COMMAND: string;
  NODE_VERSION: string;
  BUILD_DIR: string; // for Gatsby public, create-react-app usually dist
  DEPLOY_DIR: string;
  GITHUB_ACCESS_TOKEN: string;
}

export interface BuildProcess {
  [key: string]: {
    status: 'preparing' | 'building';
    container?: Container;
    event?: Event;
  };
}

export interface BuildProcessesType {
  processes: BuildProcess[];
  get: Function;
  set: Function;
  del: Function;
}
