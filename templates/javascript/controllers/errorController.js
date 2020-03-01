const AppError = require('../utils/AppError.js');

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again', 401);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;

  return new AppError(message, 400);
};

const handeValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(val => {
    return val.message;
  });

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //opperational, known, trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //programing or unknown error
    console.error('====ERROR===', err);
    res.status(err.status).json({
      status: err.status,
      message: 'server error, please try again later'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //if we're in development send us the whole error
  //it doesn't matter if it's operational or unknown error
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    //make DB and other known errors to opperational errors
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handeValidationErrorDB(error);
    if (err.name === 'JsonWebToken') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    /*
    in poduction, we are going to send status and message only
    we won't send the error stack to the client
    if err is not operational console.error,
    send generic message, and err.satus to client
    */

    sendErrorProd(error, res);
  }
};
