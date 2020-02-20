import { Container } from 'dockerode';

export interface SiteObject {
  id: string;
  name: string;
  source: string;
  domain?: string;
  buildCommand?: string;
  deployDir?: string;
}

export interface BuildEnvVars {
  SITE_ID: string;
  REPO_URL: string;
  BUILD_COMMAND: string;
  DEPLOY_DIR: string;
}

export interface BuildProcess {
  [key: string]: {
    status: 'prepare' | 'building';
    container?: Container;
  };
}

export interface BuildProcessesType {
  processes: BuildProcess[];
  get: Function;
  set: Function;
  del: Function;
}

export interface EventType {
  id: string;
  name: string;
  site: SiteObject;
  status: 'prepare' | 'building' | 'failure' | 'sucess';
  data: Date;
}
