import User from '../models/User';
import AppError from '../utils/AppError';

export const createNewUserController = async (req, res, next) => {
	const { email, password, name } = req.body;

	const newUser = await User.create({ email, password, name });

	if (!newUser) {
		throw new AppError('please provide valid username and password', 400);
	}

	res.status(201).json({
		status: 'success',
		data: newUser,
	});
};

export const getAllUsersController = async (req, res, next) => {
	const allUsers = await User.findAll();

	if (!allUsers) {
		throw new AppError('error with getting all users', 500);
	}

	res.status(200).json({
		status: 'success',
		data: allUsers,
	});
};
