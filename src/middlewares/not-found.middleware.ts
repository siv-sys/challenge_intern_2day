import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../common/errors/http-error';

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}
