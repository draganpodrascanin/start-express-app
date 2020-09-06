//allows us to use modern import and export statements in the rest of the app
require = require('esm')(module /*, options*/);
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
	'<DATABASE_PASSWORD>',
	process.env.DATABASE_PASSWORD
)
	.replace('<DATABASE_USERNAME>', process.env.DATABASE_USERNAME)
	.replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful!'))
	.catch((err) => console.error(err));

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
