export default class CustomError extends Error {
  public status: string;
  public isOperational: boolean;
  public message: string;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.message = message;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
