import express from 'express';
import sequelize from './sequelize';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import  User  from './models/user.model';
import userRouter from './routes/user.router';
import authRouter from './routes/auth.router';
import { authorizationMiddleware } from './middlewares/authorization';
import { Roles } from './utils/enums';
import Meeting from './models/meeting.model';
import meetingRouter from './routes/meeting.router';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

sequelize
	.authenticate()
	.then(() => {
		console.log('Conexión establecida con la base de datos.');
	})
	.catch((err) => {
		console.error('Error al conectar con la base de datos:', err);
	});

User.sync({ force: false });
Meeting.sync({ force: false });

app.use(json());

app.get('/', (req, res) => {
	res.send('Hola, mundo!');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/meetings', authorizationMiddleware([Roles.ADMIN, Roles.USER]), meetingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});