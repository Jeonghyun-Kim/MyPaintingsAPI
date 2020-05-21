"use strict";

const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid-v4')
const { User, Painting, RefreshToken } = require('../../models');
const winston = require('../../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../../status_code');


const getMyInfo = async (req, res, next) => {
  try {
    winston.info(`getMyInfo called!`);
    const user = await User.findOne({ where: { username: req.decoded.username } });
    if (user == null) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: DB_STATUS_CODE.COMMON_ERROR });
    };
    const paintings = await user.getPaintings();
    return res.status(HTTP_STATUS_CODE.OK).json({ user, paintings, error: DB_STATUS_CODE.OK });
  } catch {
    winston.error(`getMyInfoError: ${error}`);
    return next(error);
  };
};

const getUser = async (req, res, next) => {
  try {
    winston.info('getUser called!')
    const user = await User.findOne({
      attributes: ['id', 'username', 'name'],
      where: { id: req.params.id }
    });
    if (user == null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_USER });
    };
    return res.status(HTTP_STATUS_CODE.OK).json({ user, error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`getUserError: ${error}`);
    return next(error);
  };
};

const getUserPaintings = async (req, res, next) => {
  try {
    winston.info('getUserPaintings called!')
    const user = await User.findOne({
      attributes: ['id', 'username', 'name', 'level', 'num_fans', 'profile_pic_src', 'profile_msg'],
      where: { id: req.params.id }
    });
    if (user == null) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_USER });
    } else {
      const paintings = await user.getPaintings();
      res.status(HTTP_STATUS_CODE.OK).json({ user, paintings, error: DB_STATUS_CODE.OK });
    };
  } catch (error) {
    winston.error(`getUserPaintingsError: ${error}`);
    return next(error);
  };
};

const setUser = async (req, res, next) => {
  winston.info('setUser called!');
  const { username, name, level, email, password,
    isHashed, gender, profile_pic_src, profile_msg } = req.body;
  const hashedPassword = isHashed
  ? password
  : sha256(password);
  try {
    if (await User.findOne({ where: { username: username } })) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.USERNAME_ALREADY_OCCUPIED });
    };
    if (await User.findOne({ where: { email: email } })) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.EMAIL_ALREADY_OCCUPIED });
    };
    const user = await User.create({
      username,
      name,
      level,
      email,
      password: hashedPassword,
      gender,
      profile_pic_src,
      profile_msg
    });
    const token = jwt.sign({
      username: user.username
    }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    const refresh_token = sha256(uuidv4());
    await RefreshToken.create({ value: refresh_token, userId: user.id });

    winston.info(`TOKEN: ${token}`);
    winston.info(`RTOKEN: ${refresh_token}`);

    return res.status(HTTP_STATUS_CODE.CREATED).json({ token, refresh_token, error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`setUserError: ${error}`);
    return next(error);
  };
};

module.exports = {
  getMyInfo,
  getUser,
  getUserPaintings,
  setUser
};
