import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/tokenConfig';

export default async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    return res.json({ error: 'token not provided' });
  }

  const [, token] = authHeaders.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(400).json({ error: 'invalid token' });
  }
};
