import { Router } from 'express';
import viewsControllers from '../controllers/viewsControllers.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = Router();

router.use(authMiddleware.isLoggedIn);

router.route('/').get(viewsControllers.home);
router.route('/login').get(viewsControllers.showLogin);
router.route('/signup').get(viewsControllers.showSignup);
router.route('/forgotPassword').get(viewsControllers.showForgotPassword);
router
	.route('/users/resetpassword/:token')
	.get(viewsControllers.showResetPassword);
router
	.route('/profile')
	.get(authMiddleware.protect, viewsControllers.showProfile);

export default router;
