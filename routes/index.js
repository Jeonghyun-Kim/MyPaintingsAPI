"use strict";

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jsonParser = require('body-parser').json();
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const winston = require('../winston_config');
const { getUser, setUser } = require('../database/db_user');

// const React = require('react');
// require('babel-register')({
//   presets: [ 'react' ]
// });
// const ReactDomServer = require('react-dom/server');
// const About = require('../components/about');

const version = '0.0.1';

router.use(jsonParser);

router.use((req, res, next) => {
  (_.isUndefined(req.body))
  ? res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: DB_STATUS_CODE.COMMON_ERROR })
  : next();
});

router.route('/')
  .get((req, res, next) => {
    res.status(HTTP_STATUS_CODE.OK).json({ version: version, error: DB_STATUS_CODE.OK });
  }
);

router.route('/user')
  .get(getUser)
  .post(setUser)

module.exports = router;
