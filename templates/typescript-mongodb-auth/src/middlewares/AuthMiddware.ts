import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/CustomError';
import { promisify } from 'util';
import User from '../models/User';
import jwt from 'jsonwebtoken';

interface CookiePayload {
  id: string;
  iat: number;
}

class AuthMiddleware {
  /*
  middleware for protecting routes
  check if user is logged in (still exists / valid token)
  yes - go to next middleware,
  no - please log in
*/
  public protect = async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new CustomError(
          'You are not logged in! Please log in to get access.',
          401
        )
      );
    }

    // 2) Verification token
    const decoded = (await promisify(jwt.verify)(
      token,
      //this is checked at server.js before server startup
      process.env.JWT_SECRET!
    )) as CookiePayload;

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new CustomError(
        'The user belonging to this token does no longer exist.',
        401
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new CustomError(
        'User recently changed password! Please log in again.',
        401
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  };

  //==============================================================================================================================
  //==============================================================================================================================

  // Only for rendered pages, no errors! NOT for protecting routes!
  public isLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = (await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET!
        )) as CookiePayload;

        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }

        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }

        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

  // ==============================================================================================================================
  // ==============================================================================================================================
}

export default new AuthMiddleware();
