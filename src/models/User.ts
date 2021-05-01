import mongoose from 'mongoose';

const user = new mongoose.Schema({
  googleId: {
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

export default mongoose.model('User', user);
