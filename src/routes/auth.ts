import express from 'express';
import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from '../models/User';
import { IMongoDBUser } from '../types';

import '../misc/dotenv';

const authRouter = express.Router();

passport.serializeUser((user: any, done: any) => {
  //user: IMongoDBUser
  return done(null, user._id);
});

passport.deserializeUser((id: string, done: any) => {
  User.findById(id, (err: any, doc: IMongoDBUser) => {
    return err ? done(err) : done(null, doc);
  });
});

passport.use(
  // Login with Google
  // Create a user in MONGODB
  // Serialize & deserialize -> Grab that user from database and return him
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      // Successfull Authentication
      User.findOne(
        { googleId: profile.id },
        async (err: Error, doc: IMongoDBUser) => {
          if (err) {
            return cb(err, null);
          }
          if (!doc) {
            const newUser = new User({
              googleId: profile.id,
              name: profile.name.givenName,
              surname: profile.name?.familyName,
              photo: profile.photos?.[0]?.value,
            });
            const createdUser = await newUser.save();
            cb(null, createdUser);
          }
          if (doc) {
            cb(null, doc);
          }
        },
      );
    },
  ),
);

authRouter.get(
  '/google',
  // https://developers.google.com/identity/protocols/oauth2/scopes google sign-in
  passport.authenticate('google', { scope: ['profile'] }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
  },
);

authRouter.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send('success');
  }
});

export { authRouter };
