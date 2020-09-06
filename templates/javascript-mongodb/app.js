import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
// import CustomError from './utils/CustomError.js'

import viewsRoutes from './routes/viewsRouter.js';

import errorController from './controllers/errorController.js';
import viewController from './controllers/viewsControllers.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());

app.use('/', viewsRoutes);
app.use('*', viewController.NotFound404);

app.use(errorController);

module.exports = app;
