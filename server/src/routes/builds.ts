import { Request, Response } from 'express';

import BuildProcesses from '../BuildProcesses';

const builds = (req: Request, res: Response): void => {
  res.json(BuildProcesses.get());
};

export default builds;
