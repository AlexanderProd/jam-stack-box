import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { isProd } from '../util';

const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body?.token ||
    req.query?.token ||
    req.cookies?.token ||
    req.headers['x-access-token'];

  /**
   * Auth checking is disabled in development mode.
   */
  if (!isProd) {
    return next();
  }

  if (token) {
    jwt.verify(token, process.env.SECRET, (err: Error) => {
      if (err) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
      } else {
        return next();
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
};

export default withAuth;
