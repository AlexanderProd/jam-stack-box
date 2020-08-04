import { Request, Response } from 'express';

import startBuild from '../build';
import { Site } from '../sql';

const build = async (req: Request, res: Response) => {
  const { id } = req.params;
  let site: Site;

  if (!id) {
    return res.status(404).json({ error: 'No siteID provided!' });
  }

  try {
    site = await Site.findByPk(id);
  } catch (error) {
    return res.status(500).json({ error });
  }

  try {
    site = await Site.findOne({ where: { name: id } });
  } catch (error) {
    return res.status(500).json({ error });
  }

  if (!site) {
    return res.status(404).json({ error: 'Site not found!' });
  }
  res.sendStatus(200);

  startBuild(site);
};

export default build;
