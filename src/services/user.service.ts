import { validate } from 'class-validator';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/user.dtos';
import { IResult } from '../utils/interfaces/result.interface';
import { extractErrorKeysFromErrors } from '../utils/functions';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

export class UserService {
	async create (userCreateDTO: UserCreateDTO): Promise<IResult> {
		const errors = await validate(userCreateDTO);

		if (errors.length > 0) {
			const errorKeys = extractErrorKeysFromErrors(errors);

			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Validation failed while creating user: ${errors}`,
				entity: null,
				resultKeys: errorKeys
			};
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(userCreateDTO.password, salt);
		const { confirmPassword, confirmEmail, ...userToCreate } = userCreateDTO;

		const userCreated = await User.create({ ...userToCreate, password });

		return {
			statusCode: StatusCodes.OK,
			message: 'User created successfully!',
			entity: userCreated,
			resultKeys: ['ok']
		};
	}

	async findAll (): Promise<User[]> {
		return await User.findAll();
	}
	async findOne (id: string): Promise<IResult> {
		const user = await User.findByPk(id);

		if (user === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `No user found with ID: ${id}`,
				entity: null,
				resultKeys: ['not-found']
			};
		}

		console.log(typeof user.id);
		

		return {
			statusCode: StatusCodes.OK,
			message: 'User retrieved successfully!',
			entity: user,
			resultKeys: ['ok']
		};
	}

	async update (id: string, userUpdateDTO: UserUpdateDTO): Promise<IResult> {
		const errors = await validate(userUpdateDTO);

		if (errors.length > 0) {
			const errorKeys = extractErrorKeysFromErrors(errors);

			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Validation failed while updating user: ${errors}`,
				entity: null,
				resultKeys: errorKeys
			};
		}

		const currentUser = await User.findByPk(id);

		if (currentUser === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `No user found with ID: ${id}`,
				entity: null,
				resultKeys: ['not-found']
			};
		}

		const { confirmEmail, confirmPassword, oldPassword, ...userToUpdate } = userUpdateDTO;
		await currentUser.update(userToUpdate);
		await currentUser.reload();

		//const updatedUser = await User.findOne(id);

		return {
			statusCode: StatusCodes.OK,
			message: 'User updated successfully!',
			entity: currentUser,
			resultKeys: ['ok']
		};
	}

	async delete (id: string): Promise<IResult> {
		const userToDelete = await User.findByPk(id);

		if (userToDelete === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `No user found with ID: ${id}`,
				entity: null,
				resultKeys: ['not-found']
			};
		}

		//await userToDelete.update({ deletedAt: new Date() });
		await userToDelete.destroy();
		return {
			statusCode: StatusCodes.OK,
			message: `User with ID: ${id} successfully removed!`,
			entity: null,
			resultKeys: ['ok']
		};
	}
}