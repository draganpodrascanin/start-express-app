import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import viewsRoutes from './routes/viewsRoutes';
import { showNotFound404Controller } from './controllers/viewsControllers';

const app = express();

app.set('view engine', 'pug');
//setting views
app.set('views', path.join(__dirname, '../views'));
//serving static files
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use(cookieParser());

app.use('/', viewsRoutes);

app.use('*', showNotFound404Controller);

export default app;
