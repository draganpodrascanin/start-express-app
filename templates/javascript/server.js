//allows us to use modern import and export statements in the rest of the app
require = require('esm')(module /*, options*/);
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app.js');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}...`);
});
