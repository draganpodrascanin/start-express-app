import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
// import CustomError from '../utils/CustomError';

class UserController {
  public getAllUsers = async (
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
}
export default new UserController();
