const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const AppError = require('./utils/AppError.js');

const viewsRoutes = require('./routes/viewsRouter.js');

const errorController = require('./controllers/errorController.js');
const { NotFound404Controller } = require('./controllers/viewsControllers.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());

app.use('/', viewsRoutes);
app.use('*', NotFound404Controller);

app.use(errorController);

module.exports = app;
