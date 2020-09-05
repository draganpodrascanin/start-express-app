import { homeController } from '../controllers/viewsControllers';

const router = require('express').Router();

router.route('/').get(homeController);

export default router;
