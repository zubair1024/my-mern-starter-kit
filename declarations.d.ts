import { Request } from 'express';
import { Document, Model } from 'mongoose';

declare interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  createdTime: Date;
}
type UserModel = Model<UserDocument>;

declare type ObjectId = import('mongoose').Types.ObjectId;
declare type LeanDocument<T> = import('mongoose').LeanDocument<T>;

declare interface RequestWithAuth extends Request {
  user: UserDocument;
}
