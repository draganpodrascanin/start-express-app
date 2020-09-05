//allows us to use modern import and export statements in the rest of the app
require = require('esm')(module /*, options*/);

//setup env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
//db
const { sequelize } = require('./utils/database');
const { default: User } = require('./models/User');
//check if connected to DB if yes, start app, if not console error
const checkDB = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync({
			//force sync with models if in development
			force: process.env.NODE_ENV === 'development',
		});
		console.log('is model User? -- ', User === sequelize.model.User);
		// await User.sync();
		console.log('Connection to db has been established successfully.');

		const port = process.env.PORT || 5000;
		app.listen(port, () => {
			console.log(`App running on port ${port}...`);
		});
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

checkDB();
