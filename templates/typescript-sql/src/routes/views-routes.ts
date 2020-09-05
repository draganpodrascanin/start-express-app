import { Router } from 'express';
import ViewsController from '../controllers/ViewsController';

const router = Router();

router.get('/', ViewsController.home);

export default router;
