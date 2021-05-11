import http from 'http';
import cors from 'cors';
import WebSocket from 'ws';
import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import './misc/dotenv';

import { DBclient } from './misc/db';
import MongoStore from 'connect-mongo';

import { authRouter, userRouter } from './routes';
import { Message } from './models';
import { IMessage, IUser } from 'types';

const app: Application = express();
const clientsMap = new Map();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.set('trust proxy', 1);

app.use(express.static(__dirname + '/public'));

declare module 'express-session' {
  interface SessionData {
    user: IUser;
  }
}

const sessionParser = session({
  secret: process.env.SESSION_SECRET ?? 'secretcode',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    //@ts-ignore
    client: DBclient,
    dbName: process.env.DB_NAME,
    ttl: 1000 * 60 * 60 * 24 * 7,
  }),
  cookie: {
    // sameSite: 'none',
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
  },
});

app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);
app.use('/user', userRouter);

const PORT = process.env.PORT ?? 3001;

const server = http.createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (req, socket, head) {
  console.log('Parsing session from request...');

  //@ts-ignore
  sessionParser(req, {}, () => {
    if (!req.session?.passport?.user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    console.log('Session is parsed!');

    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit('connection', ws, req);
    });
  });
});

wss.on('connection', function (ws, req) {
  //@ts-ignore
  const userId = req.session.passport.user;
  clientsMap.set(userId, ws);

  ws.on('message', async (message: string) => {
    const json: { actionType: string; payload: IMessage } = JSON.parse(message);
    switch (json.actionType) {
      case 'chat-message': {
        const newMessage = new Message(json.payload);
        await newMessage.save();
        const { from, to } = json.payload;

        const user1 = clientsMap.get(to);
        const user2 = clientsMap.get(from);
        user1.send(message);
        user2.send(message);
        console.log(`Received message ${message} from user ${from} to ${to}`);
        break;
      }
      default:
        ws.send(new Error('Wrong query').message);
    }
  });

  ws.on('close', function () {
    clientsMap.delete(userId);
  });
});

//
// Start the server.
//
server.listen(PORT, () =>
  console.log(`The server is listening on PORT: ${PORT}`),
);
