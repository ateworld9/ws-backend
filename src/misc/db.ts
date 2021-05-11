import mongoose from 'mongoose';

export const DBclient = mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxree.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then((m) => {
    console.log('Connected mongoose successfully');
    return m.connection.getClient();
  });
// .catch((error) => {
//   console.log('Mongoose connection error \n', error);
// });
