const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRouter.js');
const homeRoutes = require('./routes/homeRouter.js');

const errorController = require('./controllers/errorController.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/', homeRoutes);
app.use('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
