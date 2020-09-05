const router = require('express').Router();
const viewsControllers = require('../controllers/viewsControllers.js');
const authControllers = require('../controllers/authControllers.js');

router.use(authControllers.isLoggedIn);

router.route('/').get(viewsControllers.homeController);
router.route('/login').get(viewsControllers.showLogin);
router.route('/signup').get(viewsControllers.showSignup);
router.route('/forgotPassword').get(viewsControllers.showForgotPassword);
router
  .route('/users/resetpassword/:token')
  .get(viewsControllers.showResetPassword);
router
  .route('/profile')
  .get(authControllers.protect, viewsControllers.showProfile);
module.exports = router;
