import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app';
import Email from '../utils/Email';

//setting enviroment vars
dotenv.config({ path: 'config.env' });
/*
  Before running any test  
  Make in memory mogno db
  Connect to it with mongoose
*/
let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
});

/*
  Befoure each test delete everything
  in in memory database
*/
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

/*
  After tests have finished running
  stop in memory database and close mongoose connection
*/
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
