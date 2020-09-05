import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import { promisify } from 'util';
import { CookiePayload } from '../utils/CookiePayload';
import { EmailTemaplates } from '../utils/EmailTemplate';
import getEnvConnection from '../utils/get-env-connection';
import { User } from '../entity/User';

export const protectMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// 1) Getting token and check if it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token)
		throw new CustomError(
			'You are not logged in! Please log in to get access.',
			401
		);
	// 2) Verification token
	const decodedjwt = (await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET!
	)) as CookiePayload;

	const connect = getEnvConnection();
	const userRepo = connect.getRepository(User);

	// 3) Get user and Check if user still exists
	const user = await userRepo.findOneOrFail(decodedjwt.id).catch((err) => {
		throw new CustomError(
			'user that belongs to this token no longer exist',
			401
		);
	});

	// 4) Check if user changed password after the token was issued
	if (user.changedPasswordAfter(new Date(decodedjwt.iat)))
		throw new CustomError(
			'User recently changed password! Please log in again.',
			401
		);

	// IF EVERYTHING OK, GRANT ACCESS TO PROTECTED ROUTE
	//set user to req and to locals
	req.user = user;
	res.locals.user = user;
	next();
};
