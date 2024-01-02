import express from 'express';
import { UserController } from '../controllers/user.controller';
import { userAccessMiddleware } from '../middlewares/user-access';
import { authorizationMiddleware } from '../middlewares/authorization';
import { Roles } from '../utils/enums';
const userRouter = express.Router();
const userController = new UserController();

const errorMessageUpdateUser = 'You cannot change the settings of another user.';
const resultKeysUpdateUser = ['different-user-updating-user-data'];

userRouter.post('/', authorizationMiddleware([Roles.ADMIN]), userController.createUser);
userRouter.get('/', authorizationMiddleware([Roles.ADMIN]), userController.getAllUsers);
userRouter.get('/:id', authorizationMiddleware([Roles.ADMIN, Roles.USER]), userController.getUser);
userRouter.put(
	'/:id',
	authorizationMiddleware([Roles.ADMIN, Roles.USER]),
	userAccessMiddleware(errorMessageUpdateUser, resultKeysUpdateUser),
	userController.updateUser
);
userRouter.delete('/:id', authorizationMiddleware([Roles.ADMIN]), userController.deleteUser);

export default userRouter;