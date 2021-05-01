export interface IUser {
  googleId?: string;
  name: string;
  surname?: string;
  photo?: string;
}

export interface IMongoDBUser {
  _id: string;
  googleId?: string;
  name: string;
  surname?: string;
  photo?: string;
  _v: number;
}
