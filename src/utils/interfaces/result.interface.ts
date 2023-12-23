import { Model } from 'sequelize';

export interface IResult {
  statusCode: number,
  message: string,
  entity: Model | null,
  resultKeys: string[]
}