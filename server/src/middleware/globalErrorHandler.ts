import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const status = err.status || "error";

  console.error("errr", message);
  console.log(err);


  res.status(statusCode).json({
    status,
    message,
    statusCode,
  });
};

export default globalErrorHandler;