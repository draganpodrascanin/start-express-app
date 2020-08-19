const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError.js');

const userRouter = require('./routes/userRouter.js');
const viewsRoutes = require('./routes/viewsRouter.js.js');

const errorController = require('./controllers/errorController.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());

//authentication login/signup/logout
app.use('/api/v1/users', userRouter);

app.use('/', viewsRoutes);

app.use('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
