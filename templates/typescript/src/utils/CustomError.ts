export default class CustomError extends Error {
  public status: string;
  public isOperational: boolean;

  constructor(message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
