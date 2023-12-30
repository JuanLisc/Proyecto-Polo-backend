import express from 'express';
import { MeetingController } from '../controllers/meeting.controller';
const meetingRouter = express.Router();

const meetingController = new MeetingController();

meetingRouter.post('/', meetingController.createMeeting);
meetingRouter.get('/', meetingController.getAllMeetings);
meetingRouter.get('/:id', meetingController.getMeeting);
meetingRouter.delete('/:id', meetingController.deleteMeeting);

export default meetingRouter;