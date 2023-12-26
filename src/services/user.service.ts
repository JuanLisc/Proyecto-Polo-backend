import { validate } from 'class-validator';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/user.dtos';
import { IResult } from '../utils/interfaces/result.interface';
import { extractErrorKeysFromErrors } from '../utils/functions';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { unsupportedNameChars } from '../utils/regular-expressions';
import { Op } from 'sequelize';

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

		const foundUser = await User.findOne({ where: { email: userCreateDTO.email } });

		if (foundUser !== null) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: 'Email already in use',
				entity: null,
				resultKeys: ['email-already-registered']
			};
		}

		if (
			!userCreateDTO.firstName.match(unsupportedNameChars)
			|| !userCreateDTO.lastName.match(unsupportedNameChars)
		) {
			return {
				statusCode: StatusCodes.FORBIDDEN,
				message: 'Names cannot contain special characters',
				entity: null,
				resultKeys: ['name-unsupported-characters']
			};
		}

		if (userCreateDTO.password !== userCreateDTO.confirmPassword) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: 'Password does not match the confirmation password',
				entity: null,
				resultKeys: ['passwords-do-not-match']
			};
		}

		if (userCreateDTO.email !== userCreateDTO.confirmEmail) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: 'Email does not match the confirmation email',
				entity: null,
				resultKeys: ['emails-do-not-match']
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
		return await User.findAll({ where: { isDeleted: false } });
	}
	async findOne (id: string): Promise<IResult> {
		const user = await User.findOne({ where: { id, isDeleted: false } });

		if (user === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `No user found with ID: ${id}`,
				entity: null,
				resultKeys: ['not-found']
			};
		}

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

		if (userUpdateDTO.email === undefined && userUpdateDTO.confirmEmail !== undefined) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: 'In order to update your Email you need to provide one',
				entity: null,
				resultKeys: ['email-empty']
			};
		}

		if (userUpdateDTO.email !== undefined && userUpdateDTO.confirmEmail === undefined) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: 'Confirmation Email required',
				entity: null,
				resultKeys: ['confirm-email-empty']
			};
		}

		if (userUpdateDTO.email !== undefined && userUpdateDTO.email !== null) {
			const isEmailInUse = await User.findOne({ where: { email: userUpdateDTO.email, id: { [Op.notLike]: currentUser.id } } });
			if (isEmailInUse !== null) {
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: 'Email already in use',
					entity: null,
					resultKeys: ['email-already-in-use']
				};
			}

			if (userUpdateDTO.email !== userUpdateDTO.confirmEmail) {
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: 'Email does not match the confirmation email',
					entity: null,
					resultKeys: ['emails-do-not-match']
				};
			}
		}

		if (
			userUpdateDTO.oldPassword === undefined
			&& (userUpdateDTO.password !== undefined || userUpdateDTO.confirmPassword !== undefined)
		) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: 'You must enter your current password to change the password',
				entity: null,
				resultKeys: ['current-password-empty']
			};
		}

		if (userUpdateDTO.oldPassword !== undefined) {
			const isPasswordCorrect = await bcrypt.compare(userUpdateDTO.oldPassword, currentUser.password);
			if (!isPasswordCorrect) {
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: 'Invalid current password, try again',
					entity: null,
					resultKeys: ['invalid-current-password']
				};
			}
			if (userUpdateDTO.password === undefined || userUpdateDTO.password === null) {
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: 'No password were provided to change the current one, try again!',
					entity: null,
					resultKeys: ['no-new-password']
				};
			}
			if (userUpdateDTO.confirmPassword !== userUpdateDTO.password) {
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: 'The password does not match, please try again',
					entity: null,
					resultKeys: ['passwords-do-not-match']
				};
			}
			const salt = await bcrypt.genSalt(10);
			userUpdateDTO.password = await bcrypt.hash(userUpdateDTO.password, salt);
		}

		const { confirmEmail, confirmPassword, oldPassword, ...userToUpdate } = userUpdateDTO;
		await currentUser.update(userToUpdate);
		await currentUser.reload();

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

		await userToDelete.update({ isDeleted: true, deletedAt: new Date() });

		return {
			statusCode: StatusCodes.OK,
			message: `User with ID: ${id} successfully removed!`,
			entity: null,
			resultKeys: ['ok']
		};
	}
}