const debug = require('debug')('gg-quizz:auth:google');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { findOrCreateUser } = require('../services/service');

const initGoogleAuth = (config, app) => {
  if (!config) {
    throw new Error('Missing configuration');
  }

  if (!config.GOOGLE_CLIENT_ID) {
    throw new Error('Missing configuration clientID');
  }

  if (!config.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing configuration clientSecret');
  }

  if (!config.GOOGLE_CALLBACK_URL) {
    throw new Error('Missing configuration callbackURL');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL
      },

      async (token, tokenSecret, profile, done) => {
        try {
          const user = await findOrCreateUser(profile);
          done(null, user);
        } catch (err) {
          debug('Got error in Google Strategy', err);
          console.error(err);
          done(err);
        }
      }
    )
  );

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: 'https://www.googleapis.com/auth/plus.login'
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
  );
};

module.exports = {
  initGoogleAuth
};
