"use strict";

const crypto = require('crypto');
const { User } = require('../models');
const winston = require('../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');

const getUser = async (req, res, next) => {
  winston.info('getUser called!');
  const { username } = req.body;
  try {
    const user = await User.findOne({
      attributes: ['username', 'name', 'level', 'num_fans', 'profile_pic_src', 'profile_msg'],
      where: { username: req.body.username }
    });
    user.error = DB_STATUS_CODE.OK;
    return res.status(HTTP_STATUS_CODE.OK).json(user);
  } catch (error) {
    winston.error(error.stack);
    return next(error);
  };
};

const setUser = async (req, res, next) => {
  winston.info('setUser called!');
  const { username, name, level, email, password,
    ishashed, gender, num_fans, profile_pic_src, profile_msg } = req.body;
  const hashedPassword = ishashed
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
    winston.error(error.stack);
    return next(error);
  };

};

module.exports = {
  getUser,
  setUser
};
