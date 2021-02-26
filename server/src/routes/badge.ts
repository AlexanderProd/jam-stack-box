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

  const header = {
    'Cache-Control': 'private',
    'Content-Type': 'image/svg+xml',
  };

  const condition = {
    [Op.or]: [{ id: { [Op.eq]: id } }, { name: { [Op.eq]: id } }],
  };

  try {
    const site = await Site.findOne({ where: condition });
    const lastEvent = await site.$get('events', {
      limit: 1,
      attributes: ['status'],
      order: [['updatedAt', 'DESC']],
    });

    switch (lastEvent[0].status) {
      case 'success': {
        const succesBadge = String(
          await readFilePromise(join(assetsFolder, 'success-status.svg'))
        );
        return res
          .header(header)
          .send(succesBadge)
          .status(200);
      }

      case 'failed':
        const failedBadge = String(
          await readFilePromise(join(assetsFolder, 'failed-status.svg'))
        );
        return res
          .header(header)
          .send(failedBadge)
          .status(200);

      case 'preparing': {
        const buildingBade = String(
          await readFilePromise(join(assetsFolder, 'building-status.svg'))
        );
        return res
          .header(header)
          .send(buildingBade)
          .status(200);
      }

      case 'building': {
        const buildingBade = String(
          await readFilePromise(join(assetsFolder, 'building-status.svg'))
        );
        return res
          .header(header)
          .send(buildingBade)
          .status(200);
      }

      default: {
        const succesBadge = String(
          await readFilePromise(join(assetsFolder, 'success-status.svg'))
        );
        return res
          .header(header)
          .send(succesBadge)
          .status(200);
      }
    }
  } catch (error) {
    const errorBadge = String(
      await readFilePromise(join(assetsFolder, 'error-status.svg'))
    );
    return res
      .header(header)
      .send(errorBadge)
      .status(200);
  }
};

export default badge;
