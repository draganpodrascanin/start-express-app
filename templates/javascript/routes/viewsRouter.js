import viewsControllers from '../controllers/viewsControllers.js';

const router = require('express').Router();

router.route('/').get(viewsControllers.home);

export default router;
