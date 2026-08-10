import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '../common/responses/api-response';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import { isProduction } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const { _token, ...result } = await authService.register(dto);
      res.cookie('token', _token, COOKIE_OPTIONS);
      res.status(201).json(successResponse(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const { _token, ...result } = await authService.login(dto);
      res.cookie('token', _token, COOKIE_OPTIONS);
      res.status(200).json(successResponse(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.getMe(userId);
      res.status(200).json(successResponse(user, 'Current user fetched'));
    } catch (error) {
      next(error);
    }
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token', { httpOnly: true, secure: isProduction, sameSite: 'lax' });
    res.status(200).json(successResponse(null, 'Logged out successfully'));
  },
};
