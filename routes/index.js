"use strict";

const express = require('express');
const router = express.Router();

const React = require('react');
require('babel-register')({
  presets: [ 'react' ]
});
const ReactDomServer = require('react-dom/server');
const About = require('../components/about');

router.get('/', (req, res, next) => {
  const aboutHTML = ReactDomServer.renderToString(About());
  res.send(aboutHTML);
});

module.exports = router;
