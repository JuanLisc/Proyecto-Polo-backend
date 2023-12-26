import { NextFunction, Request, Response } from 'express';
import { createHttpResponse } from '../utils/functions';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const authorizationMiddleware = (allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const authHeader = req.headers.authorization;

		if (authHeader === undefined || !authHeader.startsWith('Bearer')) {
			createHttpResponse(res, { statusCode: StatusCodes.UNAUTHORIZED, message: 'Token not found', resultKeys: ['token-not-found'] });
			return;
		}

		const token = authHeader.split(' ')[1];
		const decoded: jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

		const currentUser = await User.findOne({ where: { id: decoded.userId } });

		if (currentUser === null) {
			createHttpResponse(res, { statusCode: StatusCodes.NOT_FOUND, message: 'User not found', resultKeys: ['user-not-found'] });
			return;
		}

		if (!allowedRoles.includes(currentUser.role)) {
			createHttpResponse(res, { statusCode: StatusCodes.UNAUTHORIZED, message: 'Authorization failed', resultKeys: ['authorization-failed'] });
			return;
		}

		req.user = currentUser;
		next();
	};
};