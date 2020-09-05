import express from 'express';
import cookieParser from 'cookie-parser';
//allows us just to throw errors without calling next and catching async
import 'express-async-errors';
import path from 'path';
import viewsRoutes from './routes/viewsRoutes';
import { NotFound404ViewController } from './controllers/viewsController';

const app = express();

import userRouter from './routes/userRouter';
import { errorController } from './controllers/errorController';

app.set('view engine', 'pug');
//setting views
app.set('views', path.join(__dirname, '../views'));
//serving static files
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use(cookieParser());

//API Routes
app.use('/api/v1/users', userRouter);

//routes
app.use('/', viewsRoutes);

//404
app.use('*', NotFound404ViewController);

app.use(errorController);

export default app;
