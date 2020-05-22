const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const winston = require('./winston_config');
const passport = require('passport');
require('dotenv').config();

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const Router = require('./routes');
const authRouter = require('./routes/auth');

const app = express();

sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/', Router);

app.all('*', (req, res, next) => {
  const error = new Error('404 Not Found');
  error.status = 404;
  return next(error);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  winston.info(`Server listening on port ${app.get('port')}`);
});
