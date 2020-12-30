import { UserDocument } from '../models/User';
import jwt from 'jsonwebtoken';

export default (id: UserDocument['_id']) => {
  //@ts-ignore
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
