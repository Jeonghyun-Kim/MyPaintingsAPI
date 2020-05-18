"use strict";

const LocalStrategy = require('passport-local').Strategy;
const winston = require('../winston_config');
const { User } = require('../models');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        (exUser.password == password)
        ? done(null, exUser)
        : done(null, false, { error: DB_STATUS_CODE.PASSWORD_WRONG });
      } else {
        done(null, false, { error: DB_STATUS_CODE.NO_SUCH_USER });
      };
    } catch (error) {
      winston.error(`localLoginError: ${error}`);
      done(error);
    };
  }));
};
