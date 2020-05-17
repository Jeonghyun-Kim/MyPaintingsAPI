"use strict";

const crypto = require('crypto');
const { Painting, Product } = require('../models');
const winston = require('../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');

const getProduct = async (req, res, next) => {
  winston.info('getProduct called!');
  const { id } = req.body;
  if (id === undefined || id === null) {
    const error = new Error('400 Bad Request');
    error.status = HTTP_STATUS_CODE.BAD_REQUEST;
    winston.error(`getProductError: ${error}`);
    return next(error);
  };
  try {
    const product = await Product.findOne({
      attributes: ['name', 'image_src', 'content', 'price', 'on_sale', 'num_like', 'view', 'paintintId'],
      where: { id: id }
    });
    if (product === null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_PRODUCT });
    };
    return res.status(HTTP_STATUS_CODE.OK).json({ data: product, error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`getProductError: ${error}`);
    return next(error);
  };
};

const setProduct = async (req, res, next) => {
  winston.info('setProduct called!');
  const { paintingId, name, image_src, content, price, on_sale } = req.body;
  try {
    if (await Painting.findOne({ where: { id: paintingId } }) === null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: DB_STATUS_CODE.NO_SUCH_PAINTING });
    };
    await Product.create({
      name,
      image_src,
      content,
      price,
      on_sale,
      painttingId: paintingId
    });
    return res.status(HTTP_STATUS_CODE.CREATED).json({ error: DB_STATUS_CODE.OK });
  } catch (error) {
    winston.error(`setProductError: ${error}`);
    return next(error);
  };
};

module.exports = {
  getProduct,
  setProduct
};
