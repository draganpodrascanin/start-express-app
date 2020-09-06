import viewsController from '../controllers/ViewsController';

const router = require('express').Router();

router.route('/').get(viewsController.home);

export default router;
