import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/user.dtos';
import { UserService } from '../services/user.service';
import { StatusCodes } from 'http-status-codes';

const userService = new UserService();

export class UserController {
	async createUser (req: Request, res: Response): Promise<void> {
		try {
			const userCreate = plainToInstance(UserCreateDTO, req.body);

			const result = await userService.create(userCreate);

			res.status(result.statusCode).json({
				message: result.message,
				data: { result: result.entity },
				resultKeys: result.resultKeys
			});
		} catch (error: unknown) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}

	async getAllUsers (req: Request, res: Response): Promise<void> {
		try {
			const allUsers = await userService.findAll();

			res.status(StatusCodes.OK).json({ data: { result: allUsers, count: allUsers.length } });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}

	async getUser (req: Request, res: Response): Promise<void> {
		try {
			const result = await userService.findOne(req.params.id);

			res.status(result.statusCode).json({ message: result.message, data: { result: result.entity }, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}

	async updateUser (req: Request, res: Response): Promise<void> {
		try {
			const userUpdate = plainToInstance(UserUpdateDTO, req.body);

			const result = await userService.update(req.params.id, userUpdate);

			res.status(result.statusCode).json({ message: result.message, data: { result: result.entity }, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}
  
	async deleteUser (req: Request, res: Response): Promise<void> {
		try {
			const result = await userService.delete(req.params.id);

			res.status(result.statusCode).send({ data: { result: result.entity }, message: result.message, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}
}