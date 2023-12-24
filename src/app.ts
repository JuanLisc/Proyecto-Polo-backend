import express from 'express';
import sequelize from './sequelize';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import  User  from './models/user.model';
import userRouter from './routes/user.router';

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
/* 
sequelize.sync({ force: true })
	.then(() => {
		console.log('Modelos sincronizados con la base de datos.');
	})
	.catch(err => {
		console.log(err);
	});
 */

User.sync({ force: false });

app.use(json());

app.get('/', (req, res) => {
	res.send('Hola, mundo!');
});

app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});