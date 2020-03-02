import { Request, Response } from 'express';

import BuildProcesses from '../BuildProcesses';
import { Site } from '../sql';

const delSite = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ error: 'No siteID provided!' });
  }

  if (BuildProcesses.get()[id] !== undefined) {
    return res.json({
      error: 'There is an active build process with this site.',
    });
  }

  try {
    const site = await Site.findByPk(id);
    await site.destroy();
  } catch (error) {
    return res.status(500).json({ error });
  }

  res.sendStatus(200);
};

export default delSite;
