import { registerDecorator, type ValidationArguments, type ValidationOptions } from 'class-validator';
import { validPassChars } from '../regular-expressions';

export function ValidatePassword (validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			name: 'ValidatePassword',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: ['PasswordTooWeak'],
			validator: {
				validate (value: any, validationArguments: ValidationArguments) {
					return validPassChars.test(value);
				},
				defaultMessage (args: ValidationArguments) {
					return `${propertyName} must contain at least one uppercase, one lowercase and one number`;
				}
			}
		});
	};
}