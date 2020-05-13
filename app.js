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

const app = express();

const React = require('react');
require('babel-register')({
  presets: [ 'react' ]
});
const ReactDomServer = require('react-dom/server');
// const About = React.createFactory(require('./components/about.jsx'));

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

app.all('*', (req, res, next) => {
  console.error(req.url, error);
  res.send('404 Not Found.');
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = res.app.get('env') === 'development' ? err : {};
  res.status(Err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log('Server listening at port', app.get('port'));
});
