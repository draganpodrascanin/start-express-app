import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import 'express-async-errors';

import viewsRoutes from './routes/viewsRoutes';
import viewController from './controllers/viewsController';

const app = express();

app.set('view engine', 'pug');
//setting views
app.set('views', path.join(__dirname, '../views'));
//serving static files
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use(cookieParser());

app.use('/', viewsRoutes);

app.use('*', viewController.showNotFound404);

export default app;
