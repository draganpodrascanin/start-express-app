import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.passwordReset);

export default router;
