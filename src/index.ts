import express, { Application, Request, Response } from 'express';
import './misc/dotenv';
import './misc/db';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

const app: Application = express();

// app.use('/', (req: Request, res: Response) => {
//   res.status(200).send({ data: 'Hello from ateworld9' });
// });

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`The server is listening on PORT: ${PORT}`));
