import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

export function bodyValidatorMiddleware(dataValidator: ZodType) {

  return function (req: Request, res: Response, next: NextFunction): void {

    const { data, success, error } = dataValidator.safeParse(req.body);
    if (!success) {
        res.status(422).json({ error: error.flatten().fieldErrors });
        return;
    }

    req.data = data;
    next();
  };
}