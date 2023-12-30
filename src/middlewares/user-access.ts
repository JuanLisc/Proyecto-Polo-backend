import { NextFunction, Request, Response } from 'express';
import { createHttpResponse } from '../utils/functions';
import { StatusCodes } from 'http-status-codes';

export const userAccessMiddleware = (message: string, resultkey: string[]): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const loggedUser = req.user;
		const userToUpdateId = req.params.id;

		if (loggedUser?.id !== userToUpdateId) {
			createHttpResponse(res, { statusCode: StatusCodes.UNAUTHORIZED, message, resultKeys: resultkey });
			return;
		}
		next();
	};
};