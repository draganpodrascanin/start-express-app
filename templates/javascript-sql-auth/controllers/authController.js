import { Op } from 'sequelize';
import CustomError from '../utils/CustomError';
import User from '../models/User';
import crypto from 'crypto';
import ResetPasswordEmail from '../utils/Email/ResetPasswordEmail';
import signToken from '../utils/signToken';
import createSendToken from '../utils/createSendToken';

class AuthController {
	/*
  create new user in db,
  send welcome email (if you uncomment below),
	send JWT cookie and User json (password removed)
	
	you should implement some email confirmation
*/
	signup = async (req, res, next) => {
		const { email, password, passwordConfirm, firstName, lastName } = req.body;

		if (!User.passwordMatchWithPasswordConfirm(password, passwordConfirm))
			throw new CustomError(
				'password and password confirm does not match',
				400
			);

		const newUser = await User.create({
			email,
			password,
			firstName,
			lastName,
		});

		createSendToken(newUser, 201, req, res);
	};
	//==============================================================================================================================
	//==============================================================================================================================

	login = async (req, res, next) => {
		const { email, password } = req.body;

		// 1) Check if email and password exist
		if (!email || !password) {
			throw new CustomError('Please provide email and password!', 400);
		}
		// 2) Check if user exists && password is correct
		const user = await User.scope('withPassword').findOne({
			where: { email },
		});
		if (!user) {
			throw new CustomError('Incorrect email or password', 401);
		}

		console.log(user);
		const passwordMatch = await User.providedPasswordMatchUserPassword(
			password,
			user.password
		);

		if (!passwordMatch) {
			throw new CustomError('Incorrect email or password', 401);
		}

		// 3) If everything ok, send token to client
		createSendToken(user, 200, req, res);
	};

	//==============================================================================================================================
	//==============================================================================================================================

	//sending cookie to rewrite JWT i.e logging user out
	logout = (req, res) => {
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

	//==============================================================================================================================
	//==============================================================================================================================
	/*
  send password reset token to user email
*/
	forgotPassword = async (req, res, next) => {
		// 1) Get user based on POSTed email
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			throw new CustomError('There is no user with email address.', 404);
		}

		// 2) Generate the random reset token
		const resetToken = user.createPasswordResetToken();
		await user.save();

		// 3) Send it to user's email
		try {
			const resetURL = `${req.protocol}://${req.get(
				'host'
			)}/users/resetPassword/${resetToken}`;
			await new ResetPasswordEmail(user, resetURL).sendPasswordReset();

			res.status(200).json({
				status: 'success',
				message: 'Token sent to email!',
			});
		} catch (err) {
			user.passwordResetToken = null;
			user.passwordResetExpires = null;
			await user.save();

			throw new CustomError(
				'There was an error sending the email. Try again later!',
				500
			);
		}
	};

	//==============================================================================================================================
	//==============================================================================================================================
	resetPassword = async (req, res, next) => {
		const { password, passwordConfirm } = req.body;
		if (!User.passwordMatchWithPasswordConfirm(password, passwordConfirm))
			throw new CustomError(
				'password and confirm password does not match',
				400
			);

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
			throw new CustomError('Token is invalid or has expired', 400);
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

	deleteMe = async (req, res, next) => {
		const { password } = req.body;
		console.log('req.user === ', req.user);
		//get user with password
		const user = await User.scope('withPassword').findOne({
			where: { id: req.user.id },
		});

		console.log('user === ', user);
		//check if provided password match the user password
		if (!User.providedPasswordMatchUserPassword(password, user.password))
			throw new CustomError('Provide a valid password', 400);

		//set user to not active
		await User.update({ active: 0 }, { where: { id: user.id } });

		res.status(204).json({
			status: 'success',
		});
	};
}

export default new AuthController();
