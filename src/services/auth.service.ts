import { validate } from 'class-validator';
import { LoginDTO } from '../dtos/auth.dtos';
import { ILoginResult } from '../utils/interfaces/result.interface';
import { StatusCodes } from 'http-status-codes';
import { extractErrorKeysFromErrors } from '../utils/functions';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
	async login (user: LoginDTO): Promise<ILoginResult> {
		const errors = await validate(user);

		if (errors.length > 0) {
			const errorKeys = extractErrorKeysFromErrors(errors);

			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Validation failed while login in: ${errors}`,
				token: null,
				entity: null,
				resultKeys: errorKeys
			};
		}

		const currentUser = await User.findOne({ where: { email: user.email, isDeleted: false } });

		if (currentUser === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: 'Email or password incorrect!',
				token: null,
				entity: null,
				resultKeys: ['not-found']
			};
		}

		const isPasswordCorrect = await bcrypt.compare(user.password, currentUser.password);

		if (!isPasswordCorrect) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: 'Email or password incorrect!',
				token: null,
				entity: null,
				resultKeys: ['not-found']
			};
		}

		const token = jwt.sign({ userId: currentUser.id }, process.env.JWT_SECRET as string);

		return {
			statusCode: StatusCodes.OK,
			message: 'Succesfully logged in!',
			token,
			entity: currentUser,
			resultKeys: ['ok']
		};
	}
}