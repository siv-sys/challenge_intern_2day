import { NextFunction, Request, RequestHandler, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate as runValidation } from 'class-validator';
import { BadRequestError, ValidationErrorMap } from '../common/errors/http-error';

type RequestSource = 'body' | 'query' | 'params';

export function validate<T extends object>(
  DtoClass: new () => T,
  source: RequestSource = 'body',
): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const instance = plainToInstance(DtoClass, req[source], {
      enableImplicitConversion: false,
      exposeDefaultValues: true,
    });

    const errors = await runValidation(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    });

    if (errors.length > 0) {
      const errorMap: ValidationErrorMap = {};
      for (const error of errors) {
        errorMap[error.property] = error.constraints ? Object.values(error.constraints) : ['is invalid'];
      }
      next(new BadRequestError('Validation failed', errorMap));
      return;
    }

    switch (source) {
      case 'body':
        req.body = instance;
        break;
      case 'query':
        req.query = instance as unknown as Request['query'];
        break;
      case 'params':
        req.params = instance as unknown as Request['params'];
        break;
    }
    next();
  };
}
