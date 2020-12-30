import { Router } from 'express';
import viewsController from '../controllers/viewsController';

import authMiddleware from '../middlewares/AuthMiddware';

const router = Router();

router.use(authMiddleware.isLoggedIn);

router.route('/').get(viewsController.home);
router.route('/login').get(viewsController.showLogin);
router.route('/signup').get(viewsController.showSignup);
router.route('/forgotPassword').get(viewsController.showForgotPassword);
router
  .route('/users/resetpassword/:token')
  .get(viewsController.showResetPassword);
router
  .route('/profile')
  .get(authMiddleware.protect, viewsController.showProfile);

export default router;
