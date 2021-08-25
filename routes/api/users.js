import bcryptjs from 'bcryptjs';
import express from 'express';
import { check, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';

import { getJwtSecret, getJwtExpiresIn } from '../../config.js';
import User from '../../models/User.js';
import { logger } from '../../winston.js';

const router = express.Router();

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get('/', (_req, res) => {
  res.send('User Route');
});

/**
 * @route   POST api/users
 * @desc    Register user
 * @access  Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Please enter a password with 6 more characters').isLength({
      min: 6,
    }),
  ],
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<any>}
   */
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // see if the user exists
      const exists = await User.findOne({ email }).lean();
      if (exists) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User already exists',
              param: 'email',
              location: 'body',
            },
          ],
        });
      }

      // get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //create user instance
      const user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt the password using bcrypt
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      //save user
      await user.save();

      // return JWT
      jwt.sign(
        {
          user: {
            id: user.id,
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
