import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import User from '../models/User';
import crypto from 'crypto';
import { promisify } from 'util';
import Email from '../utils/email';

//create JWT function
const signToken = (id) => {
	return jwt.sign({ id, iat: Date.now() }, process.env.JWT_SECRET, {
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
const createSendToken = (user, statusCode, req, res) => {
	const token = signToken(user.id);

	res.cookie('jwt', token, {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		// secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
	});

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

//==============================================================================================================================
//==============================================================================================================================

/*
  create new user in db,
  send welcome email (if you uncomment below),
	send JWT cookie and User json (password removed)
	
	you should implement some email confirmation
*/
export const signupController = async (req, res, next) => {
	const { email, password, passwordConfirm, name } = req.body;

	if (!User.passwordMatchWithPasswordConfirm(password, passwordConfirm))
		throw new AppError('password and password confirm does not match', 400);

	const newUser = await User.create({
		name,
		email,
		password,
		name,
	});

	// const url = `${req.protocol}://${req.get('host')}/me`;
	//
	// await new Email(newUser, url).sendWelcome();

	createSendToken(newUser, 201, req, res);

	// res.status(201).json({
	// 	status: 'success',
	// 	data: newUser,
	// });
};
//==============================================================================================================================
//==============================================================================================================================

export const loginController = async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		throw new AppError('Please provide email and password!', 400);
	}
	// 2) Check if user exists && password is correct
	const user = await User.scope('withPassword').findOne({
		where: { email },
	});
	if (!user) {
		throw new AppError('Incorrect email or password', 401);
	}

	console.log(user);
	const passwordMatch = await User.providedPasswordMatchUserPassword(
		password,
		user.password
	);

	if (!passwordMatch) {
		throw new AppError('Incorrect email or password', 401);
	}

	// 3) If everything ok, send token to client
	createSendToken(user, 200, req, res);
};

//==============================================================================================================================
//==============================================================================================================================

//sending cookie to rewrite JWT i.e logging user out
export const logoutController = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({ status: 'success' });
};

//==============================================================================================================================
//==============================================================================================================================

/*
  middleware for protecting routes
  check if user is logged in (still exists / valid token)
  yes - go to next middleware,
  no - please log in
*/
export const protectMiddleware = async (req, res, next) => {
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
		throw new AppError(
			'You are not logged in! Please log in to get access.',
			401
		);
	}

	// 2) Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await User.findOne({ where: { id: decoded.id } });
	if (!currentUser) {
		return next(
			new AppError(
				'The user belonging to this token does no longer exist.',
				401
			)
		);
	}

	// 4) Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('User recently changed password! Please log in again.', 401)
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
export const isLoggedIn = async (req, res, next) => {
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
			console.log(err);
			return next();
		}
	}
	next();
};

//==============================================================================================================================
//==============================================================================================================================
/*
  send password reset token to user email
*/
export const forgotPasswordController = async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		throw new AppError('There is no user with email address.', 404);
	}

	// 2) Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save();

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
		user.passwordResetToken = null;
		user.passwordResetExpires = null;
		await user.save();

		throw new AppError(
			'There was an error sending the email. Try again later!',
			500
		);
	}
};

//==============================================================================================================================
//==============================================================================================================================
export const resetPasswordController = async (req, res, next) => {
	const { password, passwordConfirm } = req.body;
	if (!User.passwordMatchWithPasswordConfirm(password, passwordConfirm))
		throw new AppError('password and confirm password does not match', 400);

	// 1) Get user based on the token
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		where: {
			passwordResetToken: hashedToken,
			passwordResetExpires: { [Op.gt]: Date.now() },
		},
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		throw new AppError('Token is invalid or has expired', 400);
	}

	user.password = password;

	user.passwordResetToken = null;
	user.passwordResetExpires = null;
	await user.save();

	// 3) Update changedPasswordAt property for the user
	// 4) Log the user in, send JWT
	createSendToken(user, 200, req, res);
};

//==============================================================================================================================
//==============================================================================================================================

export const deleteMe = async (req, res, next) => {
	const { password } = req.body;
	console.log('req.user === ', req.user);
	//get user with password
	const user = await User.scope('withPassword').findOne({
		where: { id: req.user.id },
	});

	console.log('user === ', user);
	//check if provided password match the user password
	if (!User.providedPasswordMatchUserPassword(password, user.password))
		throw new AppError('Provide a valid password', 400);

	//set user to not active
	await User.update({ active: 0 }, { where: { id: user.id } });

	res.status(204).json({
		status: 'success',
	});
};
