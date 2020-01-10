import { Request, Response } from 'express';

import { createSiteID, saveToDB } from '../util';
import { SiteObject } from '../@types';

const createSite = async (req: Request, res: Response) => {
  const id = createSiteID();

  const data: SiteObject = {
    id,
    ...req.body,
  };

  try {
    await saveToDB(id, data);
  } catch (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json({ siteCreated: id });
};

export default createSite;
