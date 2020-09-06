import { Router } from 'express';
import viewController from '../controllers/viewsController';

const route = Router();

route.route('/').get(viewController.showIndex);

export default route;
