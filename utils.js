"use strict";

const _ = require('lodash');
const winston = require('./winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('./status_code');

const sendResponse = (res, http_code, json_data) => {
  res.status(http_code).set('X-App-Error', json_data.error).json(json_data);
};

module.exports = {
  sendResponse
}
