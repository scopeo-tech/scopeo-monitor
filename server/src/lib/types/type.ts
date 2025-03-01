import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: string;
}


export interface ErrorLogPayload {
  statusCode: number;
  route: string;
  method: string;
  message: string;
}

