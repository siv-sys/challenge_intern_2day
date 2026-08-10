import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { UpdateTaskDto } from '../dtos/task/update-task.dto';
import { PaginationQueryDto } from '../dtos/common/pagination-query.dto';
import { IdParamDto } from '../dtos/common/id-param.dto';

const router = Router();

router.use(authMiddleware);

router.get('/all', validate(PaginationQueryDto, 'query'), taskController.list);
router.get('/byid/:id', validate(IdParamDto, 'params'), taskController.getById);
router.post('/create', validate(CreateTaskDto, 'body'), taskController.create);
router.put(
  '/edit/:id',
  validate(IdParamDto, 'params'),
  validate(UpdateTaskDto, 'body'),
  taskController.update,
);
// Soft delete: task row stays in DB, isActive flips to false.
router.delete('/remove/:id', validate(IdParamDto, 'params'), taskController.remove);
// Future-ready: restore a soft-deleted task.
router.post('/restore/:id', validate(IdParamDto, 'params'), taskController.restore);
// Future-ready: permanently remove the row (admin-only later).
router.delete('/hard/:id', validate(IdParamDto, 'params'), taskController.hardDelete);

export default router;
