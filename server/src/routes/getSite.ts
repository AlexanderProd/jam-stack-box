import { Request, Response } from 'express';

import { Site } from '../sql';

const getSite = async (req: Request, res: Response) => {
  const { id } = req.params;
  let data: Site | Site[];

  try {
    if (id) {
      data = await Site.findByPk(id);
    } else {
      data = await Site.findAll();
    }

    if (!data) {
      return res.status(404).json({ error: 'Site not found!' });
    }
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default getSite;
