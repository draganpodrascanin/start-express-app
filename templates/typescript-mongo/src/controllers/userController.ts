import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: 'success',
    data: allUsers,
  });
};

export const currentUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  res.send({ data: user || null });
};
