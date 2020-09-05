import { User } from '../entity/User';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import createSendJWTToken from '../utils/create-send-jwt-cookie';
import getEnvConnection from '../utils/get-env-connection';
import PasswordResetEmail from '../utils/Email/PasswordResetEmail';
import crypto from 'crypto';

//extending Request object to take user if provided by middleware
declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

class AuthController {
	public signup = async (req: Request, res: Response, next: NextFunction) => {
		const { email, password, passwordConfirm, firstName, lastName } = req.body;
		const connect = getEnvConnection();

		if (!User.passwordMatchWithPasswordConfirm(password, passwordConfirm))
			throw new CustomError(
				'password and password confirm does not match',
				400
			);

		//getting userRepository with right connection
		const userRepository = connect.getRepository(User);

		//creating user entity
		const newUser = userRepository.create({
			email,
			password,
			firstName,
			lastName,
		});
		//hash password before saving into db
		await newUser.hashPassword();
		//save user into db
		await userRepository.save(newUser);

		//sign jwt token send as cookie and in response
		createSendJWTToken(newUser, 201, req, res);
	};

	//===================================================================================================================

	public login = async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		const connect = getEnvConnection();
		const userRepository = connect.getRepository(User);

		//get user with provided email
		const user = await userRepository
			.findOneOrFail({ where: { email } })
			.catch(() => {
				throw new CustomError('wrong email or password', 400);
			});

		//check if password is correct
		if (!(await user.isCorrectPassword(password)))
			throw new CustomError('wrong email or password', 400);

		//sign and send jwt cookie with user
		createSendJWTToken(user, 200, req, res);
	};

	//===================================================================================================================

	public logout = async (req: Request, res: Response, next: NextFunction) => {
		res.cookie('jwt', 'loggedout', {
			expires: new Date(0),
			httpOnly: true,
		});
		res.status(200).json({ status: 'success' });
	};

	//===================================================================================================================

	public forgotPassword = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { email } = req.body;
		const connect = getEnvConnection();
		const userRepo = connect.getRepository(User);

		//find user with provided email
		const user = await userRepo.findOne({ where: { email } });
		if (!user) throw new CustomError('User with this email not found', 404);

		//create passwordResetToken and passwordResetExpires on entity, get back token
		const resetToken = user.createPasswordResetToken();
		console.log(user);
		//save user entity with passwordResetToken and passwordExpires to db
		await userRepo.save(user);

		//send EMAIL with token and link for password reset
		try {
			//req.protocol = (http/https), req.get('host) = ex. www.mysyite.com
			const resetURL = `${req.protocol}://${req.get(
				'host'
			)}/resetPassword/${resetToken}`;

			await new PasswordResetEmail(user, resetURL).sendPasswordReset();

			res.status(200).json({
				status: 'success',
				message: 'Token sent to email!',
			});
		} catch (err) {
			console.log(err);
			user.passwordResetToken = null;
			user.passwordResetExpires = null;

			await userRepo.save(user);

			throw new CustomError(
				'There was an Error with sending email, please try again later',
				500
			);
		}
	};

	//===================================================================================================================

	public passwordReset = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { password, passwordConfirm } = req.body;
		const token = crypto
			.createHash('sha256')
			.update(req.params.token)
			.digest('hex');

		if (!User.passwordMatchWithPasswordConfirm(password, passwordConfirm))
			throw new CustomError(
				"password and password confirmation don't match",
				400
			);

		const connect = getEnvConnection();
		const userRepo = connect.getRepository(User);
		const user = await userRepo
			.findOneOrFail({ where: { passwordResetToken: token } })
			.catch((err) => {
				throw new CustomError(
					'token for password reset invalid, please request new password reset email',
					401
				);
			});

		if (user.checkIfPasswordResetTokenExpired())
			throw new CustomError(
				'sorry time for password has expired, please try again',
				401
			);

		//change password, hash it, and save user to db
		user.password = password;
		await user.hashPassword();
		await userRepo.save(user);

		createSendJWTToken(user, 200, req, res);
	};

	//--------------------------------------------------------------------------------------------------------------
	//testing purpose needs to be deleted
	public updateUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { email, password, firstName, lastName } = req.body;
		const connect = getEnvConnection();

		const userRepository = connect.getRepository(User);

		const user = await userRepository.findOne({ where: { id: req.params.id } });
		if (!user) throw new CustomError('User Not Found', 400);

		if (email) user.email = email;
		if (password) user.password = password;
		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;

		await userRepository.save(user);

		res.status(200).json({
			status: 'success',
			user,
		});
	};

	// ============================================================================================
}

export default new AuthController();
