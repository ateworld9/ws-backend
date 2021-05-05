import mongoose from 'mongoose';

const user = new mongoose.Schema({
  googleId: {
    required: false,
    type: String,
  },
  email: {
    required: false,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  surname: {
    required: false,
    type: String,
  },
  photo: {
    required: false,
    type: String,
  },
});

export const User = mongoose.model('User', user);
