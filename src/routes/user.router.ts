import express from 'express';
import { UserController } from '../controllers/user.controller';
import { userAccessMiddleware } from '../middlewares/user-access';
const userRouter = express.Router();
const userController = new UserController();

const errorMessageUpdateUser = 'You cannot change the settings of another user.';
const resultKeysUpdateUser = ['different-user-updating-user-data'];

userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userAccessMiddleware(errorMessageUpdateUser, resultKeysUpdateUser), userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;