"use strict";

const crypto = require('crypto');
const { User } = require('../models');
const winston = require('../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');

const getUser = async (req, res, next) => {
  winston.info('getUser called!');
  const { username, withPaintings } = req.body;
  if (username === undefined || username === null) {
    const error = new Error('400 Bad Request');
    error.status = HTTP_STATUS_CODE.BAD_REQUEST;
    winston.error(`getUserError: ${error}`);
    return next(error);
  };
  try {
    const user = await User.findOne({
      attributes: ['id', 'username', 'name', 'level', 'num_fans', 'profile_pic_src', 'profile_msg'],
      where: { username: username }
    });
    if (user == null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_USER });
    };
    if (withPaintings) {
      const paintings = await user.getPaintings();
      return res.status(HTTP_STATUS_CODE.OK).json({ user, paintings, error: DB_STATUS_CODE.OK })
    } else {
      return res.status(HTTP_STATUS_CODE.OK).json({ user, error: DB_STATUS_CODE.OK });
    };
  } catch (error) {
    winston.error(`getUserError: ${error}`);
    return next(error);
  };
};

const setUser = async (req, res, next) => {
  winston.info('setUser called!');
  const { username, name, level, email, password,
    isHashed, gender, profile_pic_src, profile_msg } = req.body;
  const hashedPassword = isHashed
  ? password
  : crypto.createHash('sha256').update(password).digest('base64');
  try {
    if (await User.findOne({ where: { username: username } })) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.USERNAME_ALREADY_OCCUPIED });
    };
    if (await User.findOne({ where: { email: email } })) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.EMAIL_ALREADY_OCCUPIED });
    };
    await User.create({
      username,
      name,
      level,
      email,
      password: hashedPassword,
      gender,
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
