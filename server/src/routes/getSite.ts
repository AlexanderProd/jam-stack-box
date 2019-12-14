import { Request, Response } from 'express';

import { getFromDB } from '../util';
import { SiteObject } from '../@types';

const getSite = async (req: Request, res: Response) => {
  const { id } = req.params;
  let site: SiteObject;

  if (!id) {
    return res.status(404).json({ error: 'No siteID provided!' });
  }

  try {
    site = await getFromDB(id);
  } catch (error) {
    return res.status(500).json({ error });
  }

  if (!site) {
    return res.status(404).json({ error: 'Site not found!' });
  }

  res.status(200).json(site);
};

export default getSite;
