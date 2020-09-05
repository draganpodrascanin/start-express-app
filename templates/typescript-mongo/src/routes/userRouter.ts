import {
  getAllUsersController,
  currentUserController,
} from '../controllers/userController';
import {
  signupController,
  loginController,
  logoutController,
  protectMiddleware,
  forgotPasswordController,
  resetPasswordController,
  updatePasswordController,
  deleteMe,
} from '../controllers/authController';

const router = require('express').Router();

router.route('/').get(getAllUsersController);
router.route('/').post(signupController);
router.route('/login').post(loginController);
router.route('/logout').post(logoutController);
router.route('/forgotPassword').post(forgotPasswordController);
router.route('/resetPassword/:token').patch(resetPasswordController);
router
  .route('/updatePassword')
  .patch(protectMiddleware, updatePasswordController);
router.route('/deleteme').delete(protectMiddleware, deleteMe);
router.route('/currentUser').get(protectMiddleware, currentUserController);
export default router;
