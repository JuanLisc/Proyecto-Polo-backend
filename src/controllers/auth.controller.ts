import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoginDTO } from '../dtos/auth.dtos';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
	async login (req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			if (email === undefined || password === undefined) {
				res.status(StatusCodes.BAD_REQUEST).send('Please, provide email and password');
				return;
			}

			const userLoginData = plainToInstance(LoginDTO, req.body);
			const result = await authService.login(userLoginData);

			res.status(result.statusCode).json({ message: result.message, data: { token: result.token, result: result.entity }, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}
}