import CustomError from '../utils/CustomError';
import { Request, Response, NextFunction } from 'express';

const checkForKownErrors = (err: Error): Error => {
	//add DB and other known errors that arent made by us
	return err;
};

export default (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let error = { ...err };
	//check for DB and other known errors that aren't made by us
	if (!(err instanceof CustomError)) error = checkForKownErrors(err) as Error;

	if (
		process.env.NODE_ENV === 'development' ||
		process.env.NODE_ENV === 'test'
	) {
		console.error(error.message);

		//if we're in development and it's our custom message
		if (error instanceof CustomError)
			return res.status(error.statusCode || 500).json({
				status: error.status,
				message: error.message,
				err: error,
				stack: error.stack,
			});

		//if we're in development and it's not our error
		return res.status(500).json({
			status: 'unhandeled error',
			message: error.message,
			stack: error.stack,
		});
	}

	// ELSE WE'RE IN PRODUCTION

	//if our custom error send status (failed or error) and error message
	if (error instanceof CustomError) {
		return res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		});
	}

	//if error unknown error in production
	res.status(500).send({
		status: 'error',
		message: 'something went wrong',
	});
};
