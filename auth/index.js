const debug = require('debug')('gg-quizz:auth');
const { initGoogleAuth } = require('./google');
const { initTwitterAuth } = require('./twitter');
const { initFacebookAuth } = require('./facebook');
const { initBnetAuth } = require('./bnet');
const { getUser } = require('../services/service');
const passport = require('passport');

const initAuth = () => {
  // serialize user into the session
  passport.serializeUser((user, done) => {
    debug('Serialize user', user.dataValues);
    done(null, user.get('id'));
  });

  passport.deserializeUser(async (id, done) => {
    debug('Deserialize user', id);
    try {
      const user = await getUser(id);
      done(null, user);
    } catch (err) {
      debug('Got error in deserializeUser', err);
      console.error(err);
      done(err);
    }
  });
};

module.exports = {
  initGoogleAuth,
  initTwitterAuth,
  initFacebookAuth,
  initBnetAuth,
  initAuth
};
