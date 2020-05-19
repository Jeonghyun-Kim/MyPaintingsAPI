"use strict";

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid-v4');
const sha256 = require('sha256');
const router = express.Router();
const jsonParser = require('body-parser').json();
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const winston = require('../winston_config');
const { verifyToken } = require('./middlewares');
const { User, RefreshToken } = require('../models');

const version = '0.0.1';

router.use(jsonParser);

router.post('/join', async (req, res, next) => {
  const { username, name, email, password, gender } = req.body;
  try {
    let exUser = await User.findOne({ where: { username } });
    if (exUser) {
      return res.status(HTTP_STATUS_CODE.NO_CONTENT)
      .json({ error: DB_STATUS_CODE.USERNAME_ALREADY_OCCUPIED });
    };
    exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(HTTP_STATUS_CODE.NO_CONTENT)
      .json({ error: DB_STATUS_CODE.EMAIL_ALREADY_OCCUPIED });
    };
    const user = await User.create({
      username,
      name,
      email,
      password,
      gender
    });
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    const refresh_token = sha256(uuidv4());
    await RefreshToken.create({ value: refresh_token, userId: user.id });

    winston.info(`TOKEN: ${token}`);
    winston.info(`RTOKEN: ${refresh_token}`);

    return res.status(HTTP_STATUS_CODE.CREATED).json({ token, refresh_token, error: DB_STATUS_CODE.OK });
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
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(info);
    };
    return req.login(user, async (loginError) => {
      if (loginError) {
        winston.error(`loginError: ${loginError}`);
        return next(loginError);
      };
      const token = jwt.sign({
        username: user.username
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      const refresh_token = (await user.getRefreshToken()).value;
      // winston.info(`REFRESH_TOKEN: ${refresh_token}`);
      return res.status(HTTP_STATUS_CODE.ACCEPTED).json({ token, refresh_token, error: DB_STATUS_CODE.OK });
    });
  })(req, res, next);
});

router.get('/logout', verifyToken, (req, res) => {
  req.logout();
  req.session.destroy();
  return res.status(HTTP_STATUS_CODE.ACCEPTED).json({ error: DB_STATUS_CODE.OK });
});

router.post('/token', async (req, res) => {
  winston.info(`req.header: ${req.headers.authorization}`);
  const { refresh_token } = req.body;
  if (refresh_token == undefined) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_REFRESH_TOKEN });
  };
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    const user = await User.findOne({ attributes: ['id'], where: { username: req.decoded.username } });
    const _refresh_token = (await user.getRefreshToken()).value;
    if (refresh_token != _refresh_token) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: DB_STATUS_CODE.INVALID_REFRESH_TOKEN });
    };
    const token = jwt.sign({
      username: user.username
    }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    return res.status(HTTP_STATUS_CODE.OK).json({ token, erroor: DB_STATUS_CODE.OK });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const user = await User.findOne({ attributes: ['id'], where: { username: req.decoded.username } });
      const _refresh_token = (await user.getRefreshToken()).value;
      if (refresh_token != _refresh_token) {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: DB_STATUS_CODE.INVALID_REFRESH_TOKEN });
      };
      const token = jwt.sign({
        username: user.username
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      return res.status(HTTP_STATUS_CODE.OK).json({ token, error: DB_STATUS_CODE.OK });
    };
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: DB_STATUS_CODE.NO_PERMISSION });
  };
})

router.get('/test', verifyToken, (req, res) => {
  res.status(HTTP_STATUS_CODE.OK).json({ error: DB_STATUS_CODE.OK });
})

module.exports = router;
