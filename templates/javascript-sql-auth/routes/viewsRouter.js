import { Router } from 'express';
const router = Router();

import viewController from '../controllers/viewsControllers';
import authMiddleware from '../middlewares/AuthMiddleware';

router.use(authMiddleware.isLoggedIn);

router.route('/').get(viewController.home);
router.route('/login').get(viewController.showLogin);
router.route('/signup').get(viewController.showSignup);
router.route('/forgotPassword').get(viewController.showForgotPassword);
router
	.route('/users/resetpassword/:token')
	.get(viewController.showResetPassword);
router
	.route('/profile')
	.get(authMiddleware.protect, viewController.showProfile);

export default router;
