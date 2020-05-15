const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
// const passport = require('passport');
require('dotenv').config();

const { sequelize } = require('./models');
// const passportConfig = require('./passport');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user')
const winston = require('./winston_config')

const app = express();

sequelize.sync();
// passportConfig(passport);

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
app.use(flash());
// app.use(passport.initialize());
// app.use(passport.sessiong());

// app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/user', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).send('404 Not Found.');
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = res.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  winston.info(`Server listening on port ${app.get('port')}`);
});
