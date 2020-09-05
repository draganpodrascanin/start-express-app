import { Router } from 'express';
import { showIndexController } from '../controllers/viewsControllers';

const route = Router();

route.route('/').get(showIndexController);

export default route;
