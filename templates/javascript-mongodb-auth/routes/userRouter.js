import express from 'express';
import userController from '../controllers/userControllers.js';
import authController from '../controllers/authControllers.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

//register new user
router.post('/', authController.signup);
//send jwt nad user model in json
router.post('/login', authController.login);
//rewrite jwt
router.post('/logout', authController.logout);

//send token to mail
router.post('/forgotPassword', authController.forgotPassword);
//reset user password with token
router.patch('/resetPassword/:token', authController.resetPassword);

//update password for current user
router.patch(
	'/updateMyPassword',
	authMiddleware.protect,
	authController.updatePassword
);

//get current user
router.get(
	'/me',
	authMiddleware.protect,
	authMiddleware.getMe,
	userController.getUser
);
//update current user
router.patch('/updateMe', authMiddleware.protect, userController.updateMe);
//delete current user
router.delete('/deleteMe', authMiddleware.protect, userController.deleteMe);

//routes after this all protected and restricted to users
//with admin or head-admin roles
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo(['admin', 'head-admin']));

//(only for admins)
//get all users
router.route('/').get(userController.getAllUsers);

//(only for admins)
//get a user with slug
//update a user with slug
//delete user from db (ACTUAL DELETE, not set to inactive)
router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

export default router;
