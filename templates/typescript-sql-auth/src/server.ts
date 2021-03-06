import 'reflect-metadata';
import createDBConnection from './utils/create-typeorm-connection';
import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });
const env = process.env.NODE_ENV;
if (!env) {
	console.log('ERROR SET YOUR ENV VARIABLES, EXITING APP NOW');
	process.exit(1);
}

const bootstrap = async () => {
	//CONNECT TO DB if fail exit app
	try {
		const connection = await createDBConnection();
		if (env === 'development') connection.synchronize();
		// await connection.synchronize();
		console.log('connected to db..');
	} catch (err) {
		console.log("couldn't connect to DB...", err);
	}

	const PORT = process.env.PORT || 8000;
	app.listen(PORT, () => {
		console.log(`app running on port ${PORT}`);
	});
};

bootstrap();
