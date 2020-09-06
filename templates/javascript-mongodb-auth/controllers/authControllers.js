import crypto from 'crypto';
import createSendToken from '../utils/createSendToken';
import User from './../models/User';
import CustomError from '../utils/CustomError';
import ResetPasswordEmail from '../utils/Email/ResetPasswordEmail';

class AuthController {
	/*
  create new user in db,
  send welcome email (if you uncomment below),
  send JWT cookie and User json (password removed)
*/
	signup = async (req, res, next) => {
		const { firstName, lastName, email, password, passwordConfirm } = req.body;

		const newUser = await User.create({
			firstName,
			lastName,
			email,
			password,
			passwordConfirm,
		});

		createSendToken(newUser, 201, req, res);
	};

	//==============================================================================================================================

	login = async (req, res, next) => {
		const { email, password } = req.body;

		// 1) Check if email and password exist
		if (!email || !password) {
			throw new CustomError('Please provide email and password!', 400);
		}
		// 2) Check if user exists && password is correct
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			throw new CustomError('Incorrect email or password', 401);
		}
		if (await user.correctPassword(password, user.password))
			throw new CustomError('Incorrect email or password', 401);

		// 3) If everything ok, send token to client
		createSendToken(user, 200, req, res);
	};
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
		await user.save({ validateBeforeSave: false });

		// 3) Send it to user's email
		try {
			// const resetURL = `${req.protocol}://${req.get(
			//   'host'
			// )}/api/v1/users/resetPassword/${resetToken}`;

			const resetURL = `${req.protocol}://${req.get(
				'host'
			)}/users/resetPassword/${resetToken}`;

			await new ResetPasswordEmail(user, resetURL).sendPasswordReset();

			res.status(200).json({
				status: 'success',
				message: 'Token sent to email!',
			});
		} catch (err) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({ validateBeforeSave: false });

			throw new CustomError(
				'There was an error sending the email. Try again later!',
				500
			);
		}
	};

	//==============================================================================================================================

	/*
  reset user password,
  get user with with token (hash token first to match one in db)
  set users new password,
  remove reset token, and reset token expires at,
  respond with new user in json and jwt in cookie
*/
	resetPassword = async (req, res, next) => {
		// 1) Get user based on the token
		const hashedToken = crypto
			.createHash('sha256')
			.update(req.params.token)
			.digest('hex');

		const user = await User.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		// 2) If token has not expired, and there is user, set the new password
		if (!user) {
			throw new CustomError('Token is invalid or has expired', 400);
		}
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();

		// 3) Update changedPasswordAt property for the user
		// 4) Log the user in, send JWT
		createSendToken(user, 200, req, res);
	};

	//==============================================================================================================================

	/*
  check if current password is correct
  update password
  send new jwt cookie and user in json
*/
	updatePassword = async (req, res, next) => {
		// 1) Get user from collection
		const user = await User.findById(req.user.id).select('+password');

		// 2) Check if POSTed current password is correct
		if (
			!(await user.correctPassword(req.body.passwordCurrent, user.password))
		) {
			throw new CustomError('Your current password is wrong.', 401);
		}

		// 3) If so, update password
		// User.findByIdAndUpdate will NOT work as intended!
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		await user.save();

		// 4) Log user in, send JWT
		createSendToken(user, 200, req, res);
	};
}

export default new AuthController();
