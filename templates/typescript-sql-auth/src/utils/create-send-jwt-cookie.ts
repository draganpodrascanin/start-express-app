import { User } from '../entity/User';
import { Request, Response } from 'express';
import signJWTToken from './signJWTToken';

export default (
	user: User,
	statusCode: number,
	req: Request,
	res: Response
) => {
	const token = signJWTToken(user.id);

	res.cookie('jwt', token, {
		expires: new Date(
			//@ts-ignore
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		// secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
	});

	// Remove password from output
	const resUser = { ...user } as any;
	delete resUser.password;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user: resUser,
		},
	});
};
