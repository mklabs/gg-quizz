const debug = require('debug')('gg-quizz:auth:twitter');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const { findOrCreateUser } = require('../services/service');

const initTwitterAuth = (config, app) => {
  if (!config) {
    throw new Error('Missing configuration');
  }

  if (!config.TWITTER_CLIENT_ID) {
    throw new Error('Missing configuration clientID');
  }

  if (!config.TWITTER_CLIENT_SECRET) {
    throw new Error('Missing configuration clientSecret');
  }

  if (!config.TWITTER_CALLBACK_URL) {
    throw new Error('Missing configuration callbackURL');
  }

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: config.TWITTER_CLIENT_ID,
        consumerSecret: config.TWITTER_CLIENT_SECRET,
        callbackURL: config.TWITTER_CALLBACK_URL
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

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );
};

module.exports = {
  initTwitterAuth
};
