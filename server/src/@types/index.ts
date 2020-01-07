import { ChildProcess } from 'child_process';

export interface SiteObject {
  id: string;
  name: string;
  source: string;
  domain?: string;
  buildCommand?: string;
  remoteDeploy?: 'true' | 'false' | undefined;
  localDeployPath?: string;
  remoteDeployPath?: string;
  sshHost?: string;
  sshPort?: string;
  sshUsername?: string;
  sshPassword?: string;
  sshKeyfilePath?: string;
}

export interface Constants {
  PORT: string | number;
  DB_DIR: string;
  FRONTEND_DIR: string;
  BUILDER_PATH: string;
  SITES_DIR: string;
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
