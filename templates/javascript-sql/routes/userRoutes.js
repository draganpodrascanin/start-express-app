import userController from '../controllers/UserController';

const router = require('express').Router();

router.route('/').get(userController.getAllUsers);
router.route('/').post(userController.createNewUser);

export default router;
