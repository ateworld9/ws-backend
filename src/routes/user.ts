import express from 'express';
import { User } from '../models';
import { IMongoDBUser } from '../types';

export const userRouter = express.Router();

userRouter.get('/users', (req, res) => {
  User.find({}, async (err: Error, users: IMongoDBUser) => {
    if (err) {
      return res.send(err);
    }
    if (!users) {
      return res.status(404).send('Users is not found');
    }
    if (users) {
      return res.status(200).send(users);
    }
  });
});

userRouter.get('/:id', (req, res) => {
  User.findOne(
    { _id: req.params.id },
    async (err: Error, user: IMongoDBUser) => {
      if (err) {
        return res.send(err);
      }
      if (!user) {
        return res.status(404).send('User id not found');
      }
      if (user) {
        return res.status(200).send(user);
      }
    },
  );
});

userRouter.get('/', (req, res) => {
  if (req.user) return res.send(req.user);
  res.status(401);
});
