import { Router } from 'express';
import viewsController from '../controllers/ViewsController';

const router = Router();

router.get('/', viewsController.home);

export default router;
