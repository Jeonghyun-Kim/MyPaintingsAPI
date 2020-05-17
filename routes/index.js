"use strict";

const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const winston = require('../winston_config');
const { getUser, setUser } = require('../database/db_user');
const { getPainting, setPainting } = require('../database/db_painting');
const { getProduct, setProduct } = require('../database/db_product');

const version = '0.0.1';

router.use(jsonParser);

router.route('/')
  .get((req, res, next) => {
    res.status(HTTP_STATUS_CODE.OK).json({ version: version, error: DB_STATUS_CODE.OK });
  }
);

router.route('/user')
  .get(getUser)
  .post(setUser)

router.route('/painting')
  .get(getPainting)
  .post(setPainting)

router.route('/product')
  .get(getProduct)
  .post(setProduct)

module.exports = router;
