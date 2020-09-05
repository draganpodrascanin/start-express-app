import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/User';
import AppError from '../utils/AppError';
import Email from '../utils/Email';

//extending Request object to take user if provided by middleware
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

interface CookiePayload {
  id: string;
  iat: number;
}

//create JWT function
const signToken = (id: UserDocument['_id']) => {
  //@ts-ignore
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/*
  apstracted send JWT and response
  sends JWT as cookie HTTP only
  for production uncomment "secure" below,
  it's for HTTPS
  example of use - createSendToken(newUser, 201, req, res);
*/
const createSendToken = (
  user: UserDocument,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      //@ts-ignore
      Date.now() + 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRES_IN
    ),
    httpOnly: true,
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  //delete will not work on user becouse user type has password property
  //so we remake the object
  const resUser: any = { ...user };

  // Remove password from output
  delete resUser.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: resUser._doc,
  });
};

//==============================================================================================================================
//==============================================================================================================================

/*
  create new user in db,
  send welcome email (if you uncomment below),
  send JWT cookie and User json (password removed)
*/
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!User.validatePasswordAndPasswordConfirm(password, passwordConfirm))
    throw new AppError('passwords do not match', 400);

  const newUser = User.build({
    email,
    name,
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
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    throw new AppError('Please provide email and password!', 400);
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Please provide valid email and password!', 400);
  }

  const validPassword = await User.correctPassword(password, user.password);

  if (!validPassword) {
    throw next(new AppError('Incorrect email or password', 400));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
};
//==============================================================================================================================
//==============================================================================================================================

//sending cookie to rewrite JWT i.e logging user out
export const logoutController = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// //==============================================================================================================================
// //==============================================================================================================================

/*
  middleware for protecting routes
  check if user is logged in (still exists / valid token)
  yes - go to next middleware,
  no - please log in
*/
export const protectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      new AppError('You are not logged in! Please log in to get access.', 401)
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
    throw new AppError(
      'The user belonging to this token does no longer exist.',
      401
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new AppError(
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
export const isLoggedIn = async (
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

/*
  send password reset token to user email
*/
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new AppError('There is no user with email address.', 404);
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError(
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
export const resetPasswordController = async (
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
    return next(new AppError('Token is invalid or has expired', 400));
  }
  if (!User.validatePasswordAndPasswordConfirm(password, passwordConfirm))
    throw new AppError('Passwords do not match', 400);

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
export const updatePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //need to be logged in (protectMiddleware)
  if (!req.user) throw new AppError('you need to be logged in', 401);
  //need to provide new password and passwordConfirm and they must match
  if (
    !User.validatePasswordAndPasswordConfirm(
      req.body.password,
      req.body.passwordConfirm
    )
  )
    throw new AppError('passwords do not match, please try again', 400);

  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  //user must exist becouse we checked if user is logged in before, so it can only be server error if !user
  if (!user)
    throw new AppError('there have been an error please try again later', 500);

  // 2) Check if provided current password is correct
  // there is a way to reset a password without knowing a current password threw email
  // this is used for user who know their passwords but still want to change it
  if (!(await User.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
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

export const deleteMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;

  if (!req.user)
    throw new AppError(
      'you need to be logged in to deactivate your account',
      400
    );

  //get user with password
  const user = await User.findById(req.user._id);

  if (!user)
    throw new AppError('there has been an error, please try later', 500);

  //check if provided password match the user password
  if (!User.correctPassword(password, user.password))
    throw new AppError('Provide a valid password', 400);

  user.active = false;
  //set user to not active
  await user.save();

  res.status(204).json({
    status: 'success',
  });
};
