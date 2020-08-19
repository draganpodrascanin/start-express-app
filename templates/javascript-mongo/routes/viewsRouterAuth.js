const viewsControllers = require('../controllers/viewsControllers.js.js');
const authControllers = require('../controllers/authControllers.js');
const router = require('express').Router();

router.use(authControllers.isLoggedIn);

router.route('/').get(viewsControllers.homeController);
router.route('/login').get(viewsControllers.showLogin);
router.route('/signup').get(viewsControllers.showSignup);
router.route('/forgotPassword').get(viewsControllers.showForgotPassword);
router
  .route('/users/resetpassword/:token')
  .get(viewsControllers.showResetPassword);
module.exports = router;
