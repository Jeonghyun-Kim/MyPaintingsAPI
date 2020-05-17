"use strict";

const crypto = require('crypto');
const { User, Painting } = require('../models');
const winston = require('../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');

const getPainting = async (req, res, next) => {
  winston.info('getPainting called!');
  const { id } = req.body;
  if (id === undefined || id === null) {
    const error = new Error('400 Bad Request');
    error.status = HTTP_STATUS_CODE.BAD_REQUEST;
    winston.error(`getPAintingError: ${error}`);
    return next(error);
  }
  try {
    const data = await Painting.findOne({
      attributes: ['name', 'image_src', 'content', 'num_like', 'view', 'userId'],
      where: { id: id }
    });
    if (data === null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_PAINTING });
    }
    return res.status(HTTP_STATUS_CODE.OK).json({ data: data, error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`getPaintingError: ${error}`);
    return next(error);
  };
};

const setPainting = async (req, res, next) => {
  winston.info('setPainting called!');
  const { username, name, image_src, content } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });
    if (user === null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_USER });
    }
    await Painting.create({
      name,
      image_src,
      content,
      userId: user.id
    });
    return res.status(HTTP_STATUS_CODE.CREATED).json({ error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`setUserError: ${error}`);

    return next(error);
  };
};

module.exports = {
  getPainting,
  setPainting
};
