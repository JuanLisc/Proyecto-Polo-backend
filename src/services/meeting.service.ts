import { StatusCodes } from 'http-status-codes';
import { MeetingCreateDTO, MeetingUpdateDTO } from '../dtos/meeting.dtos';
import { IResult } from '../utils/interfaces/result.interface';
import Meeting from '../models/meeting.model';
import { validate } from 'class-validator';
import { checkDisponibility, extractErrorKeysFromErrors, isWeekDay } from '../utils/functions';
import User from '../models/user.model';
import { Op } from 'sequelize';

export class MeetingService {
	async create (meetingCreateDTO: MeetingCreateDTO, userId: string): Promise<IResult> {
		const errors = await validate(meetingCreateDTO);

		if (errors.length > 0) {
			const errorKeys = extractErrorKeysFromErrors(errors);

			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Validation failed while creating meeting: ${errors}`,
				entity: null,
				resultKeys: errorKeys
			};
		}

		const meetingsOfUser = await this.findAll(userId);

		if (meetingsOfUser.length >= 20) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: 'A user can only have a maximum of 20 active meetings at any time',
				entity: null,
				resultKeys: ['limit-reached']
			};
		}

		if (!checkDisponibility(meetingsOfUser, meetingCreateDTO)) {
			return {
				statusCode: StatusCodes.CONFLICT,
				message: 'There are no available times for the provided date and hour',
				entity: null,
				resultKeys: ['no-available-times']
			};
		}

		console.log(!checkDisponibility(meetingsOfUser, meetingCreateDTO));

		if (!isWeekDay(meetingCreateDTO.date)) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `${meetingCreateDTO.date}" is not a weekday`,
				entity: null,
				resultKeys: ['not-weekday']
			};
		}

		const meetingCreated = await Meeting.create({ ...meetingCreateDTO, UserId: userId });

		return {
			statusCode: StatusCodes.CREATED,
			message: 'Meeting created successfully',
			entity: meetingCreated,
			resultKeys: ['ok']
		};
	}

	async findAll (userId: string, dateQuery?: Date): Promise<Meeting[]> {
		if (dateQuery === undefined) {
			return await Meeting.findAll({ where: { UserId: userId }, order: [['date', 'ASC']]});
		}
		return dateQuery
			? await Meeting.findAll({
				where: { 
					UserId: userId,
					date: {
						[Op.between]: [dateQuery, new Date(dateQuery!.getTime() + 24 * 60 * 60 * 1000)]
					}
				},
				order: [['date', 'ASC']]
			})
			: await Meeting.findAll({ where: { UserId: userId }, order: [['date', 'ASC']]});
	}

	async findOneDayMeetings (userId: string, dateQuery: Date): Promise<Meeting[]> {
		return await Meeting.findAll({
			where: { 
				UserId: userId,
				date: {
					[Op.between]: [dateQuery, new Date(dateQuery!.getTime() + 24 * 60 * 60 * 1000)]
				}
			},
			order: [['date', 'ASC']]
		});
	}

	async findOne (id: number, userId: string): Promise<IResult> {
		const meeting = await Meeting.findOne({ where: { id, UserId: userId } });

		if (meeting === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `No Meeting found with ID: ${id}`,
				entity: null,
				resultKeys: ['not-found']
			};
		}

		return {
			statusCode: StatusCodes.OK,
			message: 'Meeting retrieved successfully!',
			entity: meeting,
			resultKeys: ['ok']
		};
	}

	/* async update (id: number, meetingUpdateDTO: MeetingUpdateDTO): Promise<IResult> {
		const errors = await validate(meetingUpdateDTO);

		if (errors.length > 0) {
			const errorKeys = extractErrorKeysFromErrors(errors);

			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Validation failed while updating meeting: ${errors}`,
				entity: null,
				resultKeys: errorKeys
			};
		}

		const currentMeeting = await Meeting.findByPk(id);

		if (currentMeeting === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: 'The meeting you are trying to update does not exist',
				entity: null,
				resultKeys: ['not-found']
			};
		}

		if (!isWeekDay(meetingUpdateDTO.date)) {
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `${meetingUpdateDTO.date}" is not a weekday`,
				entity: null,
				resultKeys: ['not-weekday']
			};
		}

		await currentMeeting.update({meetingUpdateDTO});
		await currentMeeting.reload();

		return {
			statusCode: StatusCodes.OK,
			message: 'Meeting updated successfully',
			entity: currentMeeting,
			resultKeys: ['ok']
		};
	} */

	async delete (id: number, userId: string): Promise<IResult> {
		const meetingToDelete = await Meeting.findOne({ where: { id, UserId: userId }});

		if (meetingToDelete === null) {
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: 'The meeting you are trying to delete does not exist',
				entity: null,
				resultKeys: ['not-found']
			};
		}

		await meetingToDelete.destroy();

		return {
			statusCode: StatusCodes.OK,
			message: `Meeting with ID: ${id} successfully removed!`,
			entity: null,
			resultKeys: ['ok']
		};
	}
}