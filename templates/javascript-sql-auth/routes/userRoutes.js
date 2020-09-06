import userController from '../controllers/userController';
import authController from '../controllers/authController';
import authMiddleware from '../middlewares/AuthMiddleware';

const router = require('express').Router();

router.route('/').get(authMiddleware.protect, userController.getAllUsers);

router.route('/').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
	.route('/deleteme')
	.delete(authMiddleware.protect, authController.deleteMe);

export default router;
