import { Router } from 'express';
import ViewsController from '../controllers/ViewsController';
import isLoggedIn from '../middlewares/isLoggedIn';

const router = Router();

router.use(isLoggedIn);

router.get('/', ViewsController.home);
router.get('/login', ViewsController.showLogin);
router.get('/signup', ViewsController.showSignup);
router.get('/forgotPassword', ViewsController.showForgotPassword);
router.get('/resetPassword/:token', ViewsController.showResetPassword);

export default router;
