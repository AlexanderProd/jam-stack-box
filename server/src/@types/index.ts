import { Container } from 'dockerode';

export interface SiteObject {
  id: string;
  name: string;
  source: string;
  domain?: string;
  buildCommand?: string;
  deployDir?: string;
}

export interface Constants {
  PORT: string | number;
  DB_DIR: string;
  FRONTEND_DIR: string;
  BUILDER_PATH: string;
  SITES_DIR: string;
  BUILDER_IMAGE_TAG: string;
}

export interface BuildProcess {
  [key: string]: {
    status: 'prepare' | 'building';
    container?: Container;
  };
}

export interface BuildProcessesType {
  processes: BuildProcess;
  get: Function;
  set: Function;
  del: Function;
}
