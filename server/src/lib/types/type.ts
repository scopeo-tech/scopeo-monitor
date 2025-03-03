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

export interface SecurityLogPayload {
  statusCode: number;
  isSuccess: boolean;
  ip : string;
  userAgent : string
  duration : number
  isBruteForce : boolean;
  isUnusual : boolean
  unusualReason : string
}


export interface ErrorStats {
    code: number;
    count: number;
    route: string;
    message: string;
}
