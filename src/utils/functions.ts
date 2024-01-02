import { Response } from 'express';
import { IResult } from './interfaces/result.interface';
import { ValidationError } from 'class-validator';
import { compareAsc, getDay, getHours, getMinutes } from 'date-fns';
import Meeting from '../models/meeting.model';
import { MeetingCreateDTO } from '../dtos/meeting.dtos';

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

export function createHttpResponse (res: Response, result: IResult): void {
	res.status(result.statusCode).json({ message: result.message, resultKeys: result.resultKeys });
}

export function isWeekDay(date: Date): boolean {
	const day = getDay(date);

	return day >= 1 && day <= 5;
}

export function checkDisponibility(meetingsOfUser: Meeting[], newMeeting: MeetingCreateDTO): boolean {
	for (const meet of meetingsOfUser) {
		const beginningHourOldMeeting = meet.hour;
		const endingHourOldMeeting = meet.hour + meet.duration;
		const beginningHourNewMeeting = newMeeting.hour;
		const endingHourNewMeeting = newMeeting.hour + newMeeting.duration;

		if (
			(compareAsc(meet.date, newMeeting.date) === 0) && (
				(beginningHourNewMeeting >= beginningHourOldMeeting && beginningHourNewMeeting < endingHourOldMeeting) ||
				(endingHourNewMeeting > beginningHourOldMeeting && endingHourNewMeeting <= endingHourOldMeeting) ||
				(beginningHourNewMeeting <= beginningHourOldMeeting && endingHourNewMeeting >= endingHourOldMeeting)
			)
		) {
			return false;
		}
	}
	return true;
}