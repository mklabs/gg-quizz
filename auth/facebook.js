const debug = require('debug')('gg-quizz:auth:facebook');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { findOrCreateUser } = require('../services/service');

const initFacebookAuth = (config, app) => {
  if (!config) {
    throw new Error('Missing configuration');
  }

  if (!config.FACEBOOK_CLIENT_ID) {
    throw new Error('Missing configuration clientID');
  }

  if (!config.FACEBOOK_CLIENT_SECRET) {
    throw new Error('Missing configuration clientSecret');
  }

  if (!config.FACEBOOK_CALLBACK_URL) {
    throw new Error('Missing configuration callbackURL');
  }

  passport.use(
    new FacebookStrategy(
      {
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        callbackURL: config.FACEBOOK_CALLBACK_URL
      },

      async (token, tokenSecret, profile, done) => {
        try {
          const user = await findOrCreateUser(profile);
          done(null, user);
        } catch (err) {
          debug('Got error in Facebook Strategy', err);
          console.error(err);
          done(err);
        }
      }
    )
  );

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );
};

module.exports = {
  initFacebookAuth
};
