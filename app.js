const debug = require('debug')('gg-quizz:app');
const express = require('express');
require('express-async-errors');

const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const path = require('path');
const multer = require('multer');
const upload = multer();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require('hbs');
const passport = require('passport');
const Sequelize = require('sequelize');
const {
  initGoogleAuth,
  initTwitterAuth,
  initFacebookAuth,
  initBnetAuth,
  initAuth
} = require('./auth');

const { initDB } = require('./models');
const { findOrCreateUser, getUser } = require('./services/service');
const {
  addQuestion,
  renderAddQuestion,
  deleteQuestion,
  renderApi,
  index,
  login,
  logout,
  questions,
  cgu
} = require('./routes/routes');

// Server configuration

const config = process.env.NOW ? process.env : require('./now.dev.json').env;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(
  sass({
    src: path.join(__dirname, 'public/sass'),
    dest: path.join(__dirname, 'public/css'),
    debug: true,
    outputStyle: 'extended',
    // Where prefix is at <link rel="stylesheets" href="/css/style.css"/>
    prefix: '/css'
  })
);

app.use(express.static('public'));

// Passport configuration
app.use(
  session({
    secret: 'vive la league',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

initGoogleAuth(config, app);
initTwitterAuth(config, app);
initFacebookAuth(config, app);
initBnetAuth(config, app);

// Routes

app.get('/', index);
app.get('/add-question', renderAddQuestion);
app.post('/add-question', upload.array(), addQuestion);
app.get('/question/delete/:id', deleteQuestion);
app.get('/api', renderApi);
app.get('/login', login);
app.get('/logout', logout);
app.get('/questions', questions);
app.get('/cgu', cgu);

// Error managment
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500);
  res.render('error', {
    err: process.env.NOW ? err.message : err.stack
  });
});

initAuth();

// Init db and app
const init = async () => {
  debug('Init application. Environment: ', config.NODE_ENV);
  debug('Is on now:', config.NOW);

  const { connection } = await initDB(config);

  // todo: remove force when in production; swap database between PROD and DEV
  await connection.sync();

  const port = process.env.port || 3000;
  app.listen(port, err => {
    if (err) return console.error(err);
    debug(`Listening on http://localhost:${port}`);
  });
};

(async () => {
  try {
    await init();
  } catch (err) {
    console.error('Error initializing application:');
    console.error(err);
    process.exit(1);
  }
})();
