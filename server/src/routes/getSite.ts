import { Request, Response } from 'express';

import { getFromDB } from '../util';
import { SiteObject } from '../@types';

const getSite = async (req: Request, res: Response) => {
  const { id } = req.params;
  let data: SiteObject | Array<SiteObject>;

  try {
    data = await getFromDB(id);
  } catch (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json(data);
};

export default getSite;
