import {
	createNewUserController,
	getAllUsersController,
} from '../controllers/userController';

const router = require('express').Router();

router.route('/').get(getAllUsersController);
router.route('/').post(createNewUserController);

export default router;
