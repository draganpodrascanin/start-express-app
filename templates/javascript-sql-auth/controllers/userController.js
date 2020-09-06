import User from '../models/User';
import CustomError from '../utils/CustomError';

class UserController {
	createNewUser = async (req, res, next) => {
		const { email, password, name } = req.body;

		const newUser = await User.create({ email, password, name });

		if (!newUser) {
			throw new CustomError('please provide valid username and password', 400);
		}

		res.status(201).json({
			status: 'success',
			data: newUser,
		});
	};

	getAllUsers = async (req, res, next) => {
		const allUsers = await User.findAll();

		if (!allUsers) {
			throw new CustomError('error with getting all users', 500);
		}

		res.status(200).json({
			status: 'success',
			data: allUsers,
		});
	};
}

export default new UserController();
