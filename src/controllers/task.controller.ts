import { NextFunction, Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { successResponse } from '../common/responses/api-response';
import { paginatedResponse } from '../common/responses/paginated-response';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { UpdateTaskDto } from '../dtos/task/update-task.dto';
import { PaginationQueryDto } from '../dtos/common/pagination-query.dto';
import { IdParamDto } from '../dtos/common/id-param.dto';

export const taskController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const query = req.query as unknown as PaginationQueryDto;
      const { tasks, total } = await taskService.list(userId, query);
      res.status(200).json(paginatedResponse(tasks, query.page, query.limit, total));
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as unknown as IdParamDto;
      const task = await taskService.getById(userId, id);
      res.status(200).json(successResponse(task, 'Task fetched successfully'));
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const dto = req.body as CreateTaskDto;
      const task = await taskService.create(userId, dto);
      res.status(201).json(successResponse(task, 'Task created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as unknown as IdParamDto;
      const dto = req.body as UpdateTaskDto;
      const task = await taskService.update(userId, id, dto);
      res.status(200).json(successResponse(task, 'Task updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as unknown as IdParamDto;
      // Soft delete: the task row stays in the DB with isActive = false.
      const task = await taskService.delete(userId, id);
      res.status(200).json(successResponse(task, 'Task deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async restore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as unknown as IdParamDto;
      const task = await taskService.restore(userId, id);
      res.status(200).json(successResponse(task, 'Task restored successfully'));
    } catch (error) {
      next(error);
    }
  },

  async hardDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params as unknown as IdParamDto;
      await taskService.hardDelete(userId, id);
      res.status(200).json(successResponse(null, 'Task permanently deleted'));
    } catch (error) {
      next(error);
    }
  },
};