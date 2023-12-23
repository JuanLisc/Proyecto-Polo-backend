export function capitalizeFirstLetter (value: string): string {
	const array = value.split(' ');
	for (let i = 0; i < array.length; i++) {
		array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1).toLowerCase();
	}

	return array.join(' ');
}

export function camelToKebab (str: string): string {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function extractErrorKeysFromErrors (errors: ValidationError[]): string[] {
	const errorKeys = [];

	for (const error of errors) {
		for (const constraint in error.constraints) {
			errorKeys.push(
				`${error.property}-${camelToKebab(constraint)}`
			);
		}
	}

	return errorKeys;
}