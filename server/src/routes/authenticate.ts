import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const authenticate = (req: Request, res: Response) => {
  const { password } = req.body;
  const payload = { loggedIn: true };

  if (password === process.env.PASSWORD) {
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token, { httpOnly: false }).sendStatus(200);
  } else {
    res.status(401).json({ error: 'Unauthorized: Incorrect password!' });
  }
};

export default authenticate;
