import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../common/errors/http-error';
import { verifyAccessToken } from '../utils/jwt.util';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    next(new UnauthorizedError('Missing authentication cookie'));
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
