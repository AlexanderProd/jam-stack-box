import { Request, Response } from 'express';

import { Event, Site } from '../sql';

const events = async (req: Request, res: Response) => {
  const { id, limit, skip } = req.query;
  let data:
    | {
        count: number;
        rows: Event[];
      }
    | Event;

  try {
    if (id) {
      data = await Event.findByPk(id);
    } else {
      data = await Event.findAndCountAll({
        limit: limit,
        offset: skip,
        /* attributes: [
          'id',
          'name',
          'display-name',
          'status',
          'description',
          'log',
        ], */
        include: [{ model: Site, attributes: ['display-name'] }],
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'No event found!' });
    }
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export default events;
