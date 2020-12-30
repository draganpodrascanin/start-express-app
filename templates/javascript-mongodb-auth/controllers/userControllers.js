import User from '../models/User.js';
import CustomError from '../utils/CustomError';
import factory from './handlerFactory';

class UserController {
	//helper method to filter object of unwanted fields
	filterObj = (obj, ...allowedFields) => {
		const newObj = {};

		Object.keys(obj).forEach((el) => {
			if (allowedFields.includes(el)) {
				newObj[el] = obj[el];
			}
		});

		return newObj;
	};

	/*
    update user, can't be used for updating password
    only for email and name, you can modify it as you please
*/
	updateMe = async (req, res, next) => {
		// 1) Create error if user POSTs password data
		if (req.body.password || req.body.passwordConfirm) {
			throw new CustomError(
				'This route is not for password updates. Please use proper way for updating password.',
				400
			);
		}

		// 2) Filtered out unwanted fields names that are not allowed to be updated
		const filteredBody = this.filterObj(req.body, 'name', 'email');

		// 3) Update user document
		const updatedUser = await User.findByIdAndUpdate(
			req.user.id,
			filteredBody,
			{
				new: true,
				runValidators: true,
			}
		);

		res.status(200).json({
			status: 'success',
			data: {
				user: updatedUser,
			},
		});
	};

	//make current user inactive i.e. deleting him for all clients
	deleteMe = async (req, res, next) => {
		await User.findByIdAndUpdate(req.user.id, { active: false });

		res.status(204).json({
			status: 'success',
			data: null,
		});
	};

	//get one user from slug
	getUser = factory.getOne(User);
	//get all users can be filtered by query string
	getAllUsers = factory.getAll(User);

	// Do NOT update passwords with this!
	//update user that id matches the slug
	updateUser = factory.updateOne(User);

	//delete user that matches the slug
	deleteUser = factory.deleteOne(User);
}

export default new UserController();
