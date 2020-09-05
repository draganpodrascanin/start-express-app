import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import getEnvConnection from '../utils/get-env-connection';
import { User } from '../entity/User';
import { CookiePayload } from '../utils/CookiePayload';

export default async (req: Request, res: Response, next: NextFunction) => {
	if (req.cookies.jwt) {
		const jwtdecoded = (await promisify(jwt.verify)(
			req.cookies.jwt,
			process.env.JWT_SECRET!
		)) as CookiePayload;

		//get user
		const connect = getEnvConnection();
		const userRepo = connect.getRepository(User);
		const user = await userRepo.findOne(jwtdecoded.id);

		//check if theres user
		if (!user) return next();

		//check if user changed password after JWT has been issued
		if (user.changedPasswordAfter(new Date(jwtdecoded.iat))) return next;

		//if everthing is ok add user tu res.locals
		res.locals.user = user;
		return next();
	}

	next();
};
