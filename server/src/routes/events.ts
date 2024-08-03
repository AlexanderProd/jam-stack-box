import { Request, Response } from 'express';

import { Event, Site } from '../sql';

const events = async (req: Request, res: Response) => {
  const { limit, skip, siteId } = req.query;
  let data: {
    count: number;
    rows: Event[];
  };

  let limitNumber = limit ? Number(limit) : undefined;
  let skipNumber = skip ? Number(skip) : undefined;

  try {
    data = await Event.findAndCountAll({
      limit: limitNumber,
      offset: skipNumber,
      attributes: [
        'id',
        'name',
        'status',
        'description',
        'createdAt',
        'updatedAt',
        'siteId',
      ],
      order: [['createdAt', 'DESC']],
      //@ts-ignore
      include: [{ model: Site, attributes: ['name'] }],
      where: siteId ? { siteId: String(siteId) } : {},
    });

    if (!data) {
      return res.status(404).json({ error: 'No events found!' });
    }
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export default events;
