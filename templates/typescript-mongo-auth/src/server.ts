import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//setting enviroment vars
dotenv.config({ path: 'config.env' });

const bootstrap = async () => {
  if (
    !process.env.DATABASE_CONNECTION_STRING ||
    !process.env.DATABASE_PASSWORD ||
    !process.env.DATABASE_USERNAME ||
    !process.env.DATABASE_NAME ||
    !process.env.JWT_SECRET ||
    !process.env.JWT_EXPIRES_IN ||
    !process.env.JWT_COOKIE_EXPIRES_IN
  ) {
    console.log('Missing information for connecting to DB');
    process.exit(1);
  }
  //making mongo URI
  const mongoURI = process.env.DATABASE_CONNECTION_STRING.replace(
    '<DATABASE_PASSWORD>',
    process.env.DATABASE_PASSWORD
  )
    .replace('<DATABASE_USERNAME>', process.env.DATABASE_USERNAME)
    .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

  //connect to DB or exit App
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log('connected to DB');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  //set port and listen
  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

bootstrap();
