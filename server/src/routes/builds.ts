import { Request, Response } from 'express';

import BuildProcesses from '../BuildProcesses';

const builds = (req: Request, res: Response) => {
  res.json(BuildProcesses.get());
};

export default builds;
