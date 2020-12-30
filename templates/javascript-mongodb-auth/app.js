import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import CustomError from './utils/CustomError.js';
//this allows us to just throw errors and it will catch them
import 'express-async-errors';

import userRouter from './routes/userRouter.js';
import viewsRoutes from './routes/viewsRouter.js';

import errorController from './controllers/errorController.js';

import viewsController from './controllers/viewsControllers.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());

//authentication login/signup/logout
app.use('/api/v1/users', userRouter);

//not found api route
app.use('/api/v1/*', (req, res, next) => {
	next(new CustomError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use('/', viewsRoutes);

app.use('*', viewsController.NotFound404View);

app.use(errorController);

module.exports = app;
