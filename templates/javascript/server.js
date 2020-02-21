const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

let DB = process.env.DATABASE_CONNECTION_STRING.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
)
  .replace('<DATABASE_USERNAME>', process.env.DATABASE_USERNAME)
  .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
