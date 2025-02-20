import { Request, Response, NextFunction } from "express";


type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const tryCatch =
  (controller: Controller) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await controller(req, res, next);
      } catch (error) {
        return next(error)
      }
    };

export default tryCatch;