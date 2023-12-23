import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UserCreateDTO } from '../dtos/user.dtos';
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
      })
    } catch (error: unknown) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }/* ,
  async getAllUsers (req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  },
  async getUser (req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  },
  async updateUser (req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  },
  async deleteUser (req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  } */
}