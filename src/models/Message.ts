import mongoose from 'mongoose';

const message = new mongoose.Schema({
  from: {
    required: false,
    type: String,
  },
  to: {
    required: false,
    type: String,
  },
  message: {
    required: false,
    type: String,
  },
});

export const Message = mongoose.model('Message', message);
