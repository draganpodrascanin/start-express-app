const viewsControllers = require('../controllers/viewsControllers.js');

const router = require('express').Router();

router.route('/').get(viewsControllers.homeController);

module.exports = router;
