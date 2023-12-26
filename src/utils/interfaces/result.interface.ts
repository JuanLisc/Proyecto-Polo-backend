import { Model } from 'sequelize';

export interface IResult {
  statusCode: number,
  message: string,
  entity?: Model | null,
  resultKeys: string[]
}

export interface ILoginResult {
  statusCode: number,
  message: string,
  token: string | null,
  entity: Model | null,
  resultKeys: string[]
}