import { Router } from 'express';
import {
  NotFound404ViewController,
  homeController,
  showForgotPassword,
  showLogin,
  showProfile,
  showResetPassword,
  showSignup,
} from '../controllers/viewsController';

import { isLoggedIn, protectMiddleware } from '../controllers/authController';

const router = Router();

router.use(isLoggedIn);

router.route('/').get(homeController);
router.route('/login').get(showLogin);
router.route('/signup').get(showSignup);
router.route('/forgotPassword').get(showForgotPassword);
router.route('/users/resetpassword/:token').get(showResetPassword);
router.route('/profile').get(protectMiddleware, showProfile);

export default router;
