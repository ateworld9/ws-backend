import express, { Application, Request, Response } from 'express';
import { authRouter } from './routes';
import session from 'express-session';
import './misc/dotenv';
import './misc/db';
import cors from 'cors';
import passport from 'passport';

const app: Application = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie: {
      // sameSite: 'none',
      // secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);

app.get('/getuser', (req, res) => {
  res.send(req.user);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`The server is listening on PORT: ${PORT}`));
