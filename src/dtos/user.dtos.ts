import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { capitalizeFirstLetter } from '../utils/functions';
import { ValidatePassword } from '../utils/decorators/password.decorator';
import { Roles } from '../utils/enums';

export class UserCreateDTO {
  @IsNotEmpty()
	@IsEmail()
	@Transform(({ value }) => value.trim())
  	email: string;

	@IsNotEmpty()
	@IsEmail()
	@Transform(({ value }) => value.trim())
		confirmEmail: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(50)
	@Transform(({ value }) => {
		value.trim();
		value = capitalizeFirstLetter(value);
		return value;
	})
		firstName: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(50)
	@Transform(({ value }) => {
		value.trim();
		value = capitalizeFirstLetter(value);
		return value;
	})
		lastName: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(20)
	@ValidatePassword()
		password: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(20)
		confirmPassword: string;

	@IsEnum(Roles)
	@IsNotEmpty()
		role: Roles;
}