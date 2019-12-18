import { Request, Response } from 'express';

import { delFromDB } from '../util';
import BuildProcesses from '../BuildProcesses';

const delSite = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (BuildProcesses.get()[id] !== undefined) {
    return res.json({
      error: 'There is an active build process with this site.',
    });
  }

  try {
    await delFromDB(id);
  } catch (error) {
    return res.status(500).json({ error });
  }

  res.sendStatus(200);
};

export default delSite;
