import { validate } from 'class-validator';
import { UserCreateDTO } from '../dtos/user.dtos';
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
	}/* 
	async findAll (): Promise<IResult> {

	}
	async findOne (id: number): Promise<IResult> {

	}
	async update (id: number): Promise<IResult> {

	}
	async delete (id: number): Promise<IResult> {

	} */
}