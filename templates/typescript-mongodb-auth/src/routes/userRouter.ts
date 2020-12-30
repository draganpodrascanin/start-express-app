import userController from '../controllers/userController';
import authController from '../controllers/authController';
import authMiddware from '../middlewares/AuthMiddware';

const router = require('express').Router();

router.route('/').get(userController.getAllUsers);
router.route('/').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authMiddware.protect, authController.updatePassword);
router.route('/deleteme').delete(authMiddware.protect, authController.deleteMe);

export default router;
