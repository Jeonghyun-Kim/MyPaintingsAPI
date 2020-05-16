"use strict";

const crypto = require('crypto');
const { User } = require('../models');
const winston = require('../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');

const getUser = async (req, res, next) => {
  winston.info('getUser called!');
  const { username } = req.body;
  if (username === undefined || username === null) {
    const error = new Error('400 Bad Request');
    error.status = HTTP_STATUS_CODE.BAD_REQUEST;
    winston.error(`getUserError: ${error}`)
    return next(error);
  }
  try {
    const user = await User.findOne({
      attributes: ['username', 'name', 'level', 'num_fans', 'profile_pic_src', 'profile_msg'],
      where: { username: req.body.username }
    });
    return res.status(HTTP_STATUS_CODE.OK).json({ data: user, error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`getUserError: ${error}`);
    return next(error);
  };
};

const setUser = async (req, res, next) => {
  winston.info('setUser called!');
  const { username, name, level, email, password,
    isHashed, gender, num_fans, profile_pic_src, profile_msg } = req.body;
  const hashedPassword = isHashed
  ? password
  : crypto.createHash('sha256').update(password).digest('base64');
  try {
    await User.create({
      username,
      name,
      level,
      email,
      password: hashedPassword,
      gender,
      num_fans,
      profile_pic_src,
      profile_msg
    });
    return res.status(HTTP_STATUS_CODE.CREATED).json({ error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`setUserError: ${error}`);
    return next(error);
  };

};

module.exports = {
  getUser,
  setUser
};
