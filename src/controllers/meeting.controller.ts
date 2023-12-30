import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MeetingCreateDTO, MeetingUpdateDTO } from '../dtos/meeting.dtos';
import { MeetingService } from '../services/meeting.service';

const meetingService = new MeetingService();

export class MeetingController {
	async createMeeting (req: Request, res: Response): Promise<void> {
		try {
			const meetingCreate = plainToInstance(MeetingCreateDTO, req.body);
			const loggedUser = req.user;

			const result = await meetingService.create(meetingCreate, loggedUser!.id);

			res.status(result.statusCode).json({ message: result.message, data: { result: result.entity }, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}

	async getAllMeetings (req: Request, res: Response): Promise<void> {
		try {
			const loggedUser = req.user;
			const allMeetings = await meetingService.findAll(loggedUser!.id);

			res.status(StatusCodes.OK).json({ data: { result: allMeetings, count: allMeetings.length } });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}

	async getMeeting (req: Request, res: Response): Promise<void> {
		try {
			const loggedUser = req.user;
			const result = await meetingService.findOne(+req.params.id, loggedUser!.id);

			res.status(result.statusCode).json({ message: result.message, data: { result: result.entity }, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}

	/* async updateMeeting (req: Request, res: Response): Promise<void> {
		try {
			const meetingUpdate = plainToInstance(MeetingUpdateDTO, req.body);

			const result = await meetingService.update(+req.params.id, meetingUpdate);

			res.status(result.statusCode).json({ message: result.message, data: { result: result.entity }, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	} */

	async deleteMeeting (req: Request, res: Response): Promise<void> {
		try {
			const loggedUser = req.user;
			const result = await meetingService.delete(+req.params.id, loggedUser!.id);

			res.status(result.statusCode).send({ data: { result: result.entity }, message: result.message, resultKeys: result.resultKeys });
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
		}
	}
}