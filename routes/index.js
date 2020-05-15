"use strict";

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jsonParser = require('body-parser').json();
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const winston = require('../winston_config');
const { sendResponse } = require('../utils');

// const React = require('react');
// require('babel-register')({
//   presets: [ 'react' ]
// });
// const ReactDomServer = require('react-dom/server');
// const About = require('../components/about');

const version = '0.0.1';

router.use(jsonParser);

router.use((req, res, next) => {
  if (_.isUndefined(req.body)) {
    sendResponse(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, { error: DB_STATUS_CODE.COMMON_ERROR });
  } else {
    next();
  };
});

router.route('/')
  .get((req, res, next) => {
    sendResponse(res, HTTP_STATUS_CODE.OK, { error: DB_STATUS_CODE.OK, version: version });
  }
);

module.exports = router;
