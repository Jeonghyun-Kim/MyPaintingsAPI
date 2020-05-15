"use strict";

const _ = require('lodash');
const winston = require('./winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('./status_code');

const sendResponse = (res, http_code, json_data) => {
  winston.info('sendResponse called!');
  res.status(http_code).set('X-App-Error', json_data.error).json(json_data);
};

const checkSuccess = (res, next, http_code = HTTP_STATUS_CODE.OK) => {
  winston.info('checkSuccess called!');
  ( res.locals.result.error == DB_STATUS_CODE.OK )
  ? sendResponse(res, http_code, res.locals.result)
  : sendResponse(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, res.locals.result);
};

const doDBWork = async (req, res, next, db_operation) => {
  winston.info('doDBWork called!');
  try {
    res.locals.result = await db_operation(req.body);
    ( _.isUndefined(res.locals.result.error) )
    ? res.locals.result.error = DB_STATUS_CODE.RDS_SERVER_ERROR
    : next();
  } catch (error) {
    winston.error(error.stack);
    res.locals.result = { error: DB_STATUS_CODE.CONNECTION_FAILED };
    next();
  }
}

module.exports = {
  sendResponse,
  checkSuccess,
  doDBWork
};
