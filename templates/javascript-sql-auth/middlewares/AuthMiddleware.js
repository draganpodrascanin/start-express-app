import { promisify } from 'util';
import User from '../models/User';
import jwt from 'jsonwebtoken';

class AuthMiddleware {
	protect = async (req, res, next) => {
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
			throw new CustomError(
				'You are not logged in! Please log in to get access.',
				401
			);
		}

		// 2) Verification token
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

		// 3) Check if user still exists
		const currentUser = await User.findOne({ where: { id: decoded.id } });
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
	isLoggedIn = async (req, res, next) => {
		if (req.cookies.jwt) {
			try {
				// 1) verify token
				const decoded = await promisify(jwt.verify)(
					req.cookies.jwt,
					process.env.JWT_SECRET
				);

				// 2) Check if user still exists
				const currentUser = await User.findOne({ where: { id: decoded.id } });

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
}

export default new AuthMiddleware();
