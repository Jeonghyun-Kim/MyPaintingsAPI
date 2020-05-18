"use strict";

const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const winston = require('../winston_config');
const { getUser, getUserPaintings, setUser } = require('../database/db_user');
const { getPainting, getPaintingProducts, setPainting, getAll } = require('../database/db_painting');
const { getProduct, setProduct } = require('../database/db_product');

const version = '0.0.1';

router.use(jsonParser);

router.route('/')
.get((req, res, next) => {
  res.status(HTTP_STATUS_CODE.OK).json({ version: version, error: DB_STATUS_CODE.OK });
});

router.get('/user/:id', getUser);
router.get('/user/:id/paintings', getUserPaintings);
router.post('/user', setUser);

router.get('/painting/:id', getPainting);
router.get('/painting/:id/products', getPaintingProducts);
router.post('/painting', setPainting);

router.get('/paintings', getAll);

router.get('/product:id', getProduct);
router.post('/product', setProduct);

module.exports = router;
