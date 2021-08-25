import bcryptjs from 'bcryptjs';
import express from 'express';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { getJwtSecret, getJwtExpiresIn } from '../../config.js';
import auth from '../../middleware/auth.js';
import User from '../../models/User.js';
import { logger } from '../../winston.js';

const router = express.Router();

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get(
  '/',
  auth,
  /**
   * @param {import('../../declarations.js').RequestWithAuth} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route   POST api/auth
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/',
  [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Please enter a password').exists(),
  ],
  /**
   *
   * @param {import('../../declarations.js').RequestWithAuth} req
   * @param {import('express').Response} res
   * @returns
   */
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // see if the user exists
      const exists = await User.findOne({ email });
      if (!exists) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User does not exist or credentials are invalid',
              param: 'email',
              location: 'body',
            },
          ],
        });
      }

      const isMatch = await bcryptjs.compare(password, exists.password);

      if (!isMatch) {
        return res.status(401).json({
          errors: [
            {
              msg: 'User does not exist or credentials are invalid',
              param: 'email',
              location: 'body',
            },
          ],
        });
      }

      // return JWT
      jwt.sign(
        {
          user: {
            id: exists.id,
          },
        },
        getJwtSecret(),
        {
          expiresIn: getJwtExpiresIn() ?? 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
