const { User } = require('../models');
const winston = require('../winston_config');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');

const getUser = (body) => {
  winston.info(`getUser called!, called name: ${body.name}`);
  let result = { error: DB_STATUS_CODE.CONNECTION_FAILED };
  result.error = DB_STATUS_CODE.OK;
  result.data = {
    user: 'success',
    email: 'yeah@gmail.com'
  };

  return result;
};

const setUser = (body) => {
  winston.info('setUser called!');
  let result = { error: DB_STATUS_CODE.CONNECTION_FAILED };
  result.error = DB_STATUS_CODE.OK;
  result.data = {
    user: 'success',
    email: 'yeah@gmail.com'
  };

  return result;
};

module.exports = {
  setUser,
  getUser
};
