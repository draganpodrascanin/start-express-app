import CustomError from '../utils/CustomError';
import { Request, Response, NextFunction } from 'express';

declare global {
  interface Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
  }
}

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new CustomError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;

  return new CustomError(message, 400);
};

const handeValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((val: any) => {
    return val.message;
  });

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new CustomError(message, 400);
};

const checkForKownErrors = (err: any): Error => {
  if (err.name === 'ValidationError') return handeValidationErrorDB(err);
  if (err.code === 11000) return handleDuplicateFieldsDB(err);
  if (err.name === 'CastError') return handleCastErrorDB(err);
  //add DB and other known errors that arent made by us
  return err;
};

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err);
  let error;
  //check for DB and other known errors that aren't made by us
  if (!(err instanceof CustomError))
    error = checkForKownErrors(err) as CustomError;
  else error = { ...err, message: err.message } as Error;

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    if (error.isOperational) {
      return res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
        err: error,
      });
    }

    //if we're in development and it's not our error
    return res.status(500).json({
      status: 'unhandeled error',
      message: error.message,
      stack: error.stack,
    });
  }

  // ELSE WE'RE IN PRODUCTION

  //if our custom error, send status (failed or error) and error message
  if (error instanceof CustomError) {
    return res.status(error.statusCode!).json({
      status: error.status,
      message: error.message,
    });
  }

  //if error - unknown error in production
  res.status(500).send({
    status: 'error',
    message: 'something went wrong',
  });
};
