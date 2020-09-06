export default class CustomError extends Error {
	message;
	constructor(message, statusCode) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
