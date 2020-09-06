import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/User';
import CustomError from '../utils/CustomError';
import PasswordResetEmail from '../utils/Email/PasswordResetEmail';
import createSendToken from '../utils/createSendToken';

//extending Request object to take user if provided by middleware
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

class AuthController {
  //==============================================================================================================================
  //==============================================================================================================================

  /*
  create new user in db,
  send welcome email (if you uncomment below),
  send JWT cookie and User json (password removed)
*/
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    if (!User.validatePasswordAndPasswordConfirm(password, passwordConfirm))
      throw new CustomError('passwords do not match', 400);

    const newUser = User.build({
      email,
      firstName,
      lastName,
      password,
    });

    await newUser.save();

    // const url = `${req.protocol}://${req.get('host')}/me`;
    //
    // await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, req, res);
  };

  //==============================================================================================================================
  //==============================================================================================================================

  /*
  send json if provided with right user and password combination
*/
  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      throw new CustomError('Please provide email and password!', 400);
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new CustomError('Please provide valid email and password!', 400);
    }

    const validPassword = await User.correctPassword(password, user.password);

    if (!validPassword) {
      throw next(new CustomError('Incorrect email or password', 400));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
  };
  //==============================================================================================================================
  //==============================================================================================================================

  //sending cookie to rewrite JWT i.e logging user out
  public logout = (req: Request, res: Response) => {
    res.cookie('jwt', '', {
      httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
  };

  // //==============================================================================================================================
  // //==============================================================================================================================

  /*
  send password reset token to user email
*/
  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new CustomError('There is no user with email address.', 404);
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/users/resetPassword/${resetToken}`;

      await new PasswordResetEmail(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      console.log(err);
      user.resetToken = undefined;
      user.resetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new CustomError(
        'There was an error sending the email. Try again later!',
        500
      );
    }
  };

  // //==============================================================================================================================
  // //==============================================================================================================================

  /*
  reset user password,
  get user with with token (hash token first to match one in db)
  set users new password,
  remove reset token, and reset token expires at,
  respond with new user in json and jwt in cookie
*/
  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { password, passwordConfirm } = req.body;
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetExpires: { $gt: new Date(Date.now()) },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new CustomError('Token is invalid or has expired', 400));
    }
    if (!User.validatePasswordAndPasswordConfirm(password, passwordConfirm))
      throw new CustomError('Passwords do not match', 400);

    user.password = password;

    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
  };

  // //==============================================================================================================================
  // //==============================================================================================================================

  // /*
  //   check if current password is correct
  //   update password
  //   send new jwt cookie and user in json
  // */
  public updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //need to be logged in (protectMiddleware)
    if (!req.user) throw new CustomError('you need to be logged in', 401);
    //need to provide new password and passwordConfirm and they must match
    if (
      !User.validatePasswordAndPasswordConfirm(
        req.body.password,
        req.body.passwordConfirm
      )
    )
      throw new CustomError('passwords do not match, please try again', 400);

    // 1) Get user from collection
    const user = await User.findById(req.user._id).select('+password');
    //user must exist becouse we checked if user is logged in before, so it can only be server error if !user
    if (!user)
      throw new CustomError(
        'there have been an error please try again later',
        500
      );

    // 2) Check if provided current password is correct
    // there is a way to reset a password without knowing a current password threw email
    // this is used for user who know their passwords but still want to change it
    if (
      !(await User.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new CustomError('Your current password is wrong.', 401));
    }

    // 3) If everything is ok, update password
    // User.findByIdAndUpdate will NOT work as intended!
    user.password = req.body.password;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, req, res);
  };

  //==============================================================================================================================
  //==============================================================================================================================

  public deleteMe = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;

    if (!req.user)
      throw new CustomError(
        'you need to be logged in to deactivate your account',
        400
      );

    //get user with password
    const user = await User.findById(req.user._id);

    if (!user)
      throw new CustomError('there has been an error, please try later', 500);

    //check if provided password match the user password
    if (!User.correctPassword(password, user.password))
      throw new CustomError('Provide a valid password', 400);

    user.active = false;
    //set user to not active
    await user.save();

    res.status(204).json({
      status: 'success',
    });
  };
}

export default new AuthController();
