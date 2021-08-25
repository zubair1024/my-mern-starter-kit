import jwt from 'jsonwebtoken';

import { getJwtSecret } from '../config.js';

/**
 *
 * @param {import('../declarations').RequestWithAuth} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function (req, res, next) {
  try {
    // get token from the header
    const token = req.header('x-auth-token');

    // check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    //verify token
    /**@type {any} */ const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded.user;
    if (!req.user || !req.user?.id)
      return res.status(401).json({
        msg: 'There seem to have been an issue with the token, please login again. ',
      });
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
