export interface SiteDBTable {
  id: string;
  name: string;
  source: string;
  domain: string;
  output_dir: string;
  build_command: string;
}

export interface Constants {
  PORT: number;
  DB_FOLDER: string;
  FRONTEND_DIR: string;
  SITES_BUILD_FOLDER: string;
  BUILDER_PATH: string;
}
