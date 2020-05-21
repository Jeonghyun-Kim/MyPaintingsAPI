"use strict";

const crypto = require('crypto');
const { User, Painting } = require('../../models');
const winston = require('../../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../../status_code');

const getPainting = async (req, res, next) => {
  winston.info('getPainting called!');
  try {
    const painting = await Painting.findOne({
      attributes: ['id', 'name', 'image_src', 'content', 'num_like', 'view', 'userId'],
      where: { id: req.params.id }
    });
    if (painting == null) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_PAINTING });
    } else {
      res.status(HTTP_STATUS_CODE.OK).json({ painting, error: DB_STATUS_CODE.OK });
    };
  } catch (error) {
    winston.error(`getPaintingError: ${error}`);
    return next(error);
  };
};

const getPaintingProducts = async (req, res, next) => {
  winston.info('getPaintingProducts called!');
  try {
    const painting = await Painting.findOne({
      attributes: ['id', 'name', 'image_src', 'content', 'num_like', 'view', 'userId'],
      where: { id: req.params.id }
    });
    if (painting == null) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_PAINTING });
    } else {
      const products = await painting.getProducts();
      res.status(HTTP_STATUS_CODE.OK).json({ painting, products, error: DB_STATUS_CODE.OK });
    };
  } catch (error) {
    winston.error(`getPaintingProductsError: ${error}`);
    return next(error);
  };
};

const setPainting = async (req, res, next) => {
  winston.info('setPainting called!');
  const { name, image_src, content } = req.body;
  try {
    const user = await User.findOne({ where: { username: req.decoded.username } });
    if (user == null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_USER });
    };
    await Painting.create({
      name,
      image_src,
      content,
      userId: user.id
    });
    return res.status(HTTP_STATUS_CODE.CREATED).json({ error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`setPaintingError: ${error}`);
    return next(error);
  };
};

const getAll = async (req, res, next) => {
  winston.info('getAll called!');
  try {
    const paintings = await Painting.findAll({});
    return res.status(HTTP_STATUS_CODE.OK).json({ paintings, error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`getAllError: ${error}`);
    return next(error);
  };
};

module.exports = {
  getPainting,
  getPaintingProducts,
  setPainting,
  getAll
};
