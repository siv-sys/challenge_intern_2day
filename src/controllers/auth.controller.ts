import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '../common/responses/api-response';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const user = await authService.register(dto);
      res.status(201).json(successResponse(user, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const result = await authService.login(dto);
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
};
