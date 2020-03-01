const viewsControllers = require('../controllers/viewsControllers.js');
const authControllers = require('../controllers/authControllers.js');
const router = require('express').Router();

router.use(authControllers.isLoggedIn);

router.route('/').get(viewsControllers.homeController);
router.route('/login').get(viewsControllers.showLogin);
router.route('/signup').get(viewsControllers.showSignup);

module.exports = router;
