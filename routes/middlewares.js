"use strict";

const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODE, DB_STATUS_CODE } = require('../status_code');
const { User } = require('../models');

const verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS_CODE.TOKEN_EXPIRED).json({ error: DB_STATUS_CODE.TOKEN_EXPIRED });
    };
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: DB_STATUS_CODE.NO_PERMISSION });
  };
}

const verifyAdmin = async (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    userLevel = await User.findOne({ attributes: ['level'], where: { username: req.decoded.username  } })
    if (userLevel < 99) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: DB_STATUS_CODE.NO_PERMISSION });
    }
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS_CODE.TOKEN_EXPIRED).json({ error: DB_STATUS_CODE.TOKEN_EXPIRED });
    };
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ error: DB_STATUS_CODE.NO_PERMISSION });
  };
}


module.exports = {
  verifyToken,
  verifyAdmin
};
