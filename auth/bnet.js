const debug = require('debug')('gg-quizz:auth:bnet');
const passport = require('passport');
const BnetStrategy = require('passport-bnet').Strategy;
const { findOrCreateUser } = require('../services/service');

const initBnetAuth = (config, app) => {
  if (!config) {
    throw new Error('Missing configuration');
  }

  if (!config.BNET_ID) {
    throw new Error('Missing configuration clientID');
  }

  if (!config.BNET_SECRET) {
    throw new Error('Missing configuration clientSecret');
  }

  if (!config.BNET_CALLBACK_URL) {
    throw new Error('Missing configuration callbackURL');
  }

  passport.use(
    new BnetStrategy(
      {
        clientID: config.BNET_ID,
        clientSecret: config.BNET_SECRET,
        callbackURL: config.BNET_CALLBACK_URL,
        region: 'us'
      },

      async (token, tokenSecret, profile, done) => {
        try {
          debug('Battle net profile', profile);
          const user = await findOrCreateUser(profile);
          done(null, user);
        } catch (err) {
          debug('Got error in Battle.net Strategy', err);
          console.error(err);
          done(err);
        }
      }
    )
  );

  app.get('/auth/bnet', passport.authenticate('bnet'));

  app.get(
    '/auth/bnet/callback',
    passport.authenticate('bnet', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
  );
};

module.exports = {
  initBnetAuth
};
