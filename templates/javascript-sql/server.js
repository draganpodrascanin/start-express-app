//allows us to use modern import and export statements in the rest of the app
require = require('esm')(module /*, options*/);

//setup env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
//db
const { sequelize } = require('./utils/database');

//check if connected to DB if yes, start app, if not console error
const checkDB = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync({
			//force sync with models if in development
			force: process.env.NODE_ENV === 'development',
		});
		// await User.sync();
		console.log('Connected to db..');

		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`App running on port ${PORT}...`);
		});
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

checkDB();
