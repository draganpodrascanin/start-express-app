import express from 'express';
//allows us just to throw errors without calling next and catching async
import 'express-async-errors';
import path from 'path';
import cookieParser from 'cookie-parser';

import AppError from './utils/AppError.js';

import viewsRoutes from './routes/viewsRouter';
import userRoutes from './routes/userRoutes';

import errorController from './controllers/errorController';

const {
	NotFound404ViewController,
} = require('./controllers/viewsControllers.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRoutes);
//not found api route
app.use('/api/v1/*', (req, res, next) => {
	next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use('/', viewsRoutes);
app.use('*', NotFound404ViewController);

app.use(errorController);

module.exports = app;
