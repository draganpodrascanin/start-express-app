//I will rework error handling for TS,
//I Love this aproach for JS, it just doesn't play well with TS
//This will work fine, just not beutifull code

import AppError from '../utils/AppError';
import { Request, Response, NextFunction } from 'express';

declare global {
  interface Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
  }
}
// >>>>>> uncomment if you're using mongo <<<<<<
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value`;

  return new AppError(message, 400);
};

const handeValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((val: any) => {
    return val.message;
  });

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

//JWT errors
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again', 401);
};

//>>>>>> uncomment if you're using mysql <<<<<<
// const handleDuplicateFieldsDB = (err: any) => {
// 	const message = err.errors[0].message.split('.')[1];
// 	return new AppError(message, 400);
// };

// const handleValidationError = (err: any) => {
// 	const values = err.errors.map((field: any) => `${field.path} is not valid`);
// 	const message = values.join('. ');
// 	return new AppError(message, 400);
// };

//=============================================================================================

const sendErrorDev = (err: Error | AppError, res: Response) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  //opperational, known, trusted error
  if (err.isOperational) {
    // console.log(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programing or unknown error
    console.error('====ERROR===', err);
    res.status(err.status).json({
      status: err.status,
      message: 'server error, please try again later',
    });
  }
};

export const errorController = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //if we're in development send us the whole error
  //it doesn't matter if it's operational or unknown error
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test'
  ) {
    let error = { ...err };

    //make DB and other known errors to opperational errors
    // >>>>> UNCOMMENT IF USING MOGNO <<<<<
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    //@ts-ignore
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handeValidationErrorDB(err);

    // UNCOMMENT IF USING JWT
    if (err.name === 'JsonWebToken') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // >>>>> UNCOMMENT IF USING MYSQL <<<<<
    // if (err.name === 'SequelizeUniqueConstraintError')
    // 	error = handleDuplicateFieldsDB(error);
    // if (err.name === 'SequelizeValidationError')
    // 	error = handleValidationError(error);

    /*
    in poduction, we are going to send status and message only
    we won't send the error stack to the client
    if err is not operational console.error,
    send generic message, and err.satus 500 to client
    */

    sendErrorProd(error, res);
  }
};