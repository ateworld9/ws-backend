import mongoose from 'mongoose';

export default mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxree.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => {
    console.log('Connected mongoose successfully');
  })
  .catch((error) => {
    console.log('Mongoose connection error \n', error);
  });
