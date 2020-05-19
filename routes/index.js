"use strict";

const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const winston = require('../winston_config');
const { getUser, getUserPaintings, setUser } = require('./database/db_user');
const { getPainting, getPaintingProducts, setPainting, getAll } = require('./database/db_painting');
const { getProduct, setProduct } = require('./database/db_product');
const { verifyToken, verifyAdmin } = require('./middlewares');

const version = '0.0.1';

router.use(jsonParser);

router.get('/', (req, res, next) => {
  res.status(HTTP_STATUS_CODE.OK).json({ version: version, error: DB_STATUS_CODE.OK });
});

router.get('/user/:id', verifyToken, getUser);
router.get('/user/:id/paintings', verifyToken, getUserPaintings);
router.post('/user', setUser);

router.get('/painting/:id', verifyToken, getPainting);
router.get('/painting/:id/products', verifyToken, getPaintingProducts);
router.post('/painting', verifyToken, setPainting);

router.get('/paintings', verifyToken, getAll);

router.get('/product:id', verifyToken, getProduct);
router.post('/product', verifyToken, setProduct);

module.exports = router;
