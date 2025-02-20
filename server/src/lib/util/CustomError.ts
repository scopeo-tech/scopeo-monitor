export class CustomError extends Error {
    statusCode: number;
    data?: unknown;
    constructor(message: string, statusCode: number, data?: unknown) {
      super(message);
      this.statusCode = statusCode;
      this.data = data;
    }
  }