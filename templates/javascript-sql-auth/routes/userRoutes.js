import {
	createNewUserController,
	getAllUsersController,
} from '../controllers/userController';
import {
	signupController,
	loginController,
	logoutController,
	forgotPasswordController,
	resetPasswordController,
	deleteMe,
	protectMiddleware,
} from '../controllers/authController';

const router = require('express').Router();

router.route('/').get(getAllUsersController);

router.route('/signup').post(signupController);
router.route('/login').post(loginController);
router.route('/logout').post(logoutController);
router.route('/forgotPassword').post(forgotPasswordController);
router.route('/resetPassword/:token').patch(resetPasswordController);
router.route('/deleteme').delete(protectMiddleware, deleteMe);

export default router;
