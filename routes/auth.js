"use strict";

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jsonParser = require('body-parser').json();
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const winston = require('../winston_config');
const { checkLoggedIn, checkNotLoggedIn, verifyToken } = require('./middlewares');
const { User } = require('../models');

const version = '0.0.1';

router.use(jsonParser);

router.post('/join', async (req, res, next) => {
  const { username, name, email, password, gender } = req.body;
  try {
    let exUser = await User.find({ username });
    if (exUser) {
      return res.status(HTTP_STATUS_CODE.NO_CONTENT)
      .json({ error: DB_STATUS_CODE.USERNAME_ALREADY_OCCUPIED });
    };
    exUser = await User.find({ email });
    if (exUser) {
      return res.status(HTTP_STATUS_CODE.NO_CONTENT)
      .json({ error: DB_STATUS_CODE.EMAIL_ALREADY_OCCUPIED });
    };
    await User.create({
      username,
      name,
      email,
      password,
      gender
    });
  } catch (error) {
    winston.error(`joinError: ${error}`);
    return next(error);
  };
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      winston.error(`authError: ${authError}`);
      return next(authError);
    };
    if (!user) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .json({ error: DB_STATUS_CODE.LOGIN_FAILED });
    };
    return req.login(user, (loginError) => {
      if (loginError) {
        winston.error(`loginError: ${loginError}`);
        return next(loginError);
      };
      const token = jwt.sign({
        username: user.username
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      return res.status(HTTP_STATUS_CODE.ACCEPTED).json({ token, error: DB_STATUS_CODE.OK });
    });
  })(req, res, next);
});

router.get('/logout', verifyToken, (req, res) => {
  req.logout();
  req.session.destroy();
  return res.status(HTTP_STATUS_CODE.ACCEPTED).json({ error: DB_STATUS_CODE.OK });
});

router.get('/test', verifyToken, (req, res) => {
  res.status(HTTP_STATUS_CODE.OK).json({ error: DB_STATUS_CODE.OK });
})

module.exports = router;
