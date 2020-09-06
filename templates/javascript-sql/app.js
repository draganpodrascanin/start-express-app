import express from 'express';
//allows us just to throw errors without calling next and catching async
import 'express-async-errors';
import path from 'path';
import cookieParser from 'cookie-parser';

// import CustomError from './utils/CustomError.js'

import viewsRoutes from './routes/viewsRouter';
import userRoutes from './routes/userRoutes';

import errorController from './controllers/errorController';
// const errorController = require('./controllers/errorController.js');
import viewsController from './controllers/ViewsController';

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
	next(new CustomError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use('/', viewsRoutes);
app.use('*', viewsController.NotFound404);

app.use(errorController);

module.exports = app;
