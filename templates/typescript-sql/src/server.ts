import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

//CONNECT TO DB
createConnection()
	.then(async (connection) => {
		console.log('contected to db');

		//APP LISTENING
		const PORT = process.env.PORT || 8000;
		app.listen(PORT, () => {
			console.log(`app listening on ${PORT}`);
		});
	})
	.catch((error) => console.log(error));
