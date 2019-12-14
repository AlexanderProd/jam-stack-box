import { ChildProcess } from 'child_process';

export interface SiteObject {
  id: string;
  name: string;
  source: string;
  domain?: string;
  buildCommand?: string;
}

export interface Constants {
  PORT: number;
  DB_FOLDER: string;
  FRONTEND_DIR: string;
  BUILDER_PATH: string;
}

export interface BuildProcess {
  [key: string]: ChildProcess;
}

export interface BuildProcessesType {
  processes: BuildProcess;
  get: Function;
  set: Function;
  del: Function;
}