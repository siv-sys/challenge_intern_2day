import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../common/errors/http-error';
import { ApiErrorResponse } from '../common/responses/api-response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    const body: ApiErrorResponse = {
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    };
    res.status(err.statusCode).json(body);
    return;
  }

  console.error(err instanceof Error ? err.stack : err);

  const body: ApiErrorResponse = {
    success: false,
    message: 'Internal server error',
  };
  res.status(500).json(body);
}
