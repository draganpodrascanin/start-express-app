import { UserDocument } from '../models/User';
import { Request, Response } from 'express';
import signToken from './signToken';

/*
  apstracted send JWT and response
  sends JWT as cookie HTTP only
  for production uncomment "secure" below,
  it's for HTTPS
  example of use - createSendToken(newUser, 201, req, res);
*/
export default (
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
