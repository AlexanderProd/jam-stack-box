import { Request, Response } from 'express';

import { Site } from '../sql';
import { sanitizeName, sanitizeBuildDir } from '../util';

const createSite = async (req: Request, res: Response) => {
  const data: Site = {
    ...req.body,
    name: sanitizeName(req.body.name),
    buildDir: req.body.buildDir
      ? sanitizeBuildDir(req.body.buildDir)
      : 'public',
    displayName: req.body.name,
  };

  /**
   * Check if site name has been used already.
   */
  try {
    const result = await Site.findOne({
      where: { name: data.name },
      rejectOnEmpty: false,
    });
    if (result) {
      return res.status(500).json({ error: 'Site name already used!' });
    }
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }

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
