const express = require('express');
const userController = require('../controllers/userControllers.js');
const authController = require('../controllers/authControllers.js');

const router = express.Router();

//register new user
router.post('/signup', authController.signup);
//send jwt nad user model in json
router.post('/login', authController.login);
//rewrite jwt
router.get('/logout', authController.logout);

//send token to mail
router.post('/forgotPassword', authController.forgotPassword);
//reset user password with token
router.patch('/resetPassword/:token', authController.resetPassword);

//update password for current user
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

//get current user
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
//update current user
router.patch('/updateMe', authController.protect, userController.updateMe);
//delete current user
router.delete('/deleteMe', authController.protect, userController.deleteMe);

//routes after this all protected and restricted to users
//with admin or head-admin roles
router.use(authController.protect);
router.use(authController.restrictTo(['admin', 'head-admin']));

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

module.exports = router;
