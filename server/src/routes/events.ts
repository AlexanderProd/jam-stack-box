import { Request, Response } from 'express';

import { Event, Site } from '../sql';

const events = async (req: Request, res: Response) => {
  const { limit, skip } = req.query;
  let data: {
    count: number;
    rows: Event[];
  };

  try {
    data = await Event.findAndCountAll({
      limit: limit,
      offset: skip,
      attributes: [
        'id',
        'name',
        'status',
        'description',
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', 'DESC']],
      include: [{ model: Site, attributes: ['name'] }],
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
