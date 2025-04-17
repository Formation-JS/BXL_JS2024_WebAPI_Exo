import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

export function bodyValidatorMiddleware(dataValidator: ZodType) {

  return function (req: Request, res: Response, next: NextFunction): void {

    const { data, success, error } = dataValidator.safeParse(req.body);
    if (!success) {

      let { fieldErrors, formErrors } = error.flatten();

      let requestError = null;
      if (formErrors.length > 0) {
        requestError = { request: formErrors.filter(msg => !!msg) };
      }

      res.status(422).json({ error: requestError ?? fieldErrors });
      return;
    }

    req.data = data;
    next();
  };
}