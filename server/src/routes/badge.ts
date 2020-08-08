import { Request, Response } from 'express';
import { promisify } from 'util';
import { Op } from 'sequelize';
import { readFile } from 'fs';
import { join } from 'path';

import constants from '../config';
import { Site } from '../sql';

const assetsFolder = join(constants.FRONTEND_DIR, '/../', 'assets');
const readFilePromise = promisify(readFile);

const badge = async (req: Request, res: Response) => {
  const { id } = req.params;

  const succesBadge = String(
    await readFilePromise(join(assetsFolder, 'success-status.svg'))
  );
  const buildingBade = String(
    await readFilePromise(join(assetsFolder, 'building-status.svg'))
  );
  const failedBadge = String(
    await readFilePromise(join(assetsFolder, 'failed-status.svg'))
  );
  const errorBadge = String(
    await readFilePromise(join(assetsFolder, 'error-status.svg'))
  );

  const header = {
    'Cache-Control': 'private',
    'Content-Type': 'image/svg+xml',
  };

  const condition = {
    [Op.or]: [{ id: { [Op.eq]: id } }, { name: { [Op.eq]: id } }],
  };

  try {
    const site = await Site.findOne({ where: condition });
    const lastEvent = await site.getEvents({
      limit: 1,
      attributes: ['status'],
      order: [['updatedAt', 'DESC']],
    });

    switch (lastEvent[0].status) {
      case 'success':
        return res
          .header(header)
          .send(succesBadge)
          .status(200);

      case 'failed':
        return res
          .header(header)
          .send(failedBadge)
          .status(200);

      case 'preparing':
        return res
          .header(header)
          .send(buildingBade)
          .status(200);

      case 'building':
        return res
          .header(header)
          .send(buildingBade)
          .status(200);

      default:
        return res
          .header(header)
          .send(succesBadge)
          .status(200);
    }
  } catch (error) {
    return res
      .header(header)
      .send(errorBadge)
      .status(200);
  }
};

export default badge;
