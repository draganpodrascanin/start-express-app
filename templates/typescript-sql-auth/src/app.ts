import express from 'express';
//allows us just to throw errors without calling next and catching async
import 'express-async-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import CustomError from './utils/CustomError';

import viewsRoutes from './routes/views-routes';
import userRoutes from './routes/user-routes';
import ViewsController from './controllers/ViewsController';
import ErrorController from './controllers/ErrorController';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

//Serving static files
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRoutes);
//not found api route
app.use('/api/v1/*', (req, res, next) => {
	throw new CustomError(`can't find ${req.originalUrl} on this server`, 404);
});

app.use('/', viewsRoutes);
app.use('*', ViewsController.NotFound404View);

app.use(ErrorController);

export default app;
