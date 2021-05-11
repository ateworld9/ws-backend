export interface IMessage {
  from: string;
  to: string;
  message: string;
  //createdAT
}

export interface IMongoDBMessage {
  _id: string;
  __v: string;
  from: string;
  to: string;
  message: string;
}
