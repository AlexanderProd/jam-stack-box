import { Request, Response } from 'express';

import { Site } from '../sql';
import { sanitizeName } from '../util';

const createSite = async (req: Request, res: Response) => {
  const data: Site = {
    ...req.body,
    name: sanitizeName(req.body.name),
    displayName: req.body.name,
  };

  try {
    const newSite = await Site.create(data);
    res
      .status(200)
      .json({ siteCreated: { id: newSite.id, name: newSite.name } });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
};

export default createSite;
