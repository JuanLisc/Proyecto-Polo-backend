import express from 'express';
import { UserController } from '../controllers/user.controller';
const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/', userController.createUser);
/* userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser); */

export default userRouter;