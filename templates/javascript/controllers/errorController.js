//>>>>>> uncomment if you're using mongo <<<<<<
import CustomError from '../utils/CustomError.js';

const handleJWTError = () => {
	return new CustomError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = () => {
	return new CustomError('Your token has expired. Please log in again', 401);
};

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new CustomError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value`;

	return new CustomError(message, 400);
};

const handeValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((val) => {
		return val.message;
	});

	const message = `Invalid input data. ${errors.join('. ')}`;

	return new CustomError(message, 400);
};

//>>>>>> uncomment if you're using mysql <<<<<<
// const handleDuplicateFieldsDB = (err) => {
// 	const message = err.errors[0].message.split('.')[1];
// 	return new CustomError(message, 400);
// };

// const handleValidationError = (err) => {
// 	const values = err.errors.map((field) => `${field.path} is not valid`);
// 	const message = values.join('. ');
// 	return new CustomError(message, 400);
// };

const checkForKnownErrors = (error) => {
	// make DB and other known errors to opperational errors

	// >>>>> UNCOMMENT IF USING MONGODB <<<<<
	if (err.name === 'CastError') return handleCastErrorDB(error);
	if (err.code === 11000) return handleDuplicateFieldsDB(error);
	if (err.name === 'ValidationError') return handeValidationErrorDB(error);

	//UNCOMENT IF USING JWT
	// if (err.name === 'JsonWebToken') return handleJWTError();
	// if (err.name === 'TokenExpiredError') return handleJWTExpiredError();

	// >>>>> UNCOMMENT IF USING MYSQL <<<<<
	// if (err.name === 'SequelizeUniqueConstraintError')
	//   return handleDuplicateFieldsDB(error);
	// if (err.name === 'SequelizeValidationError')
	//   return handleValidationError(error);

	//check for known error, if not found return original error
	return error;
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	//opperational, known, trusted error
	if (err.isOperational) {
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

export default (err, req, res, next) => {
	let error;
	if (!err.isOperational) error = checkForKnownErrors(err);
	else error = { ...err };

	error.statusCode = error.statusCode || 500;
	error.status = error.status || 'error';

	//if we're in development send us the whole error
	//it doesn't matter if it's operational or unknown error
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(error, res);
	} else if (process.env.NODE_ENV === 'production') {
		/*
    in poduction, we are going to send status and message only
    we won't send the error stack to the client
    if err is not operational console.error,
    send generic message, and err.satus to client
    */

		sendErrorProd(error, res);
	}
};
