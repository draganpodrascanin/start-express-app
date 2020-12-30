import { Router } from 'express';
import viewsController from '../controllers/viewsController';

const router = Router();

router.route('/').get(viewsController.home);

export default router;
