import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

function validationMiddleware(schemas: Joi.Schema[]): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
    };

    try {
      const schema = Array.isArray(req.body) ? schemas[1] : schemas[0];
      const value = await schema.validateAsync(req.body, validationOptions);

      req.body = value;
      next();
    } catch (e: any) {
      const errors: string[] = [];
      e.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push(error.message);
      });

      res.status(400).send({ errors });
    }
  };
}

export default validationMiddleware;
