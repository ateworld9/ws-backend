import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import './misc/dotenv';
import './misc/db';
import cors from 'cors';
import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app: Application = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'secretcode',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  return done(null, user);
});

passport.deserializeUser((user: any, done) => {
  return done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      console.log('PROFILE', profile);

      cb(null, profile);
    },
  ),
);

app.use('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello from ateworld9' });
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
  },
);

app.get('/getuser', (req, res) => {
  res.send(req.user);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`The server is listening on PORT: ${PORT}`));
