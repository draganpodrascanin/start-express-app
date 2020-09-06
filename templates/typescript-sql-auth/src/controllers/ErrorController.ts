import CustomError from '../utils/CustomError';
import { Request, Response, NextFunction } from 'express';

declare global {
	interface Error {
		statusCode?: number;
		status?: string;
		isOperational?: boolean;
	}
}

const handleDuplicateEntry = (err: any) => {
	const what = err.sqlMessage.split("'")[1];
	return new CustomError(
		`${what} is duplicate entry, this field must be unique`,
		400
	);
};

const checkForKownErrors = (err: any): Error => {
	if (err.code === 'ER_DUP_ENTRY') return handleDuplicateEntry(err);
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
	if (!err.isOperational) error = checkForKownErrors(err) as CustomError;
	else error = { ...err, message: err.message } as Error;

	console.log('err', err);
	console.log('error', error);
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
