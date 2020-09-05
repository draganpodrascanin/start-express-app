import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

const port = process.env.PORT || 8000;

const bootstrap = () => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

bootstrap();
