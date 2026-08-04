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

router.get('/', validate(PaginationQueryDto, 'query'), taskController.list);
router.get('/:id', validate(IdParamDto, 'params'), taskController.getById);
router.post('/', validate(CreateTaskDto, 'body'), taskController.create);
router.put(
  '/:id',
  validate(IdParamDto, 'params'),
  validate(UpdateTaskDto, 'body'),
  taskController.update,
);
router.delete('/:id', validate(IdParamDto, 'params'), taskController.remove);

export default router;
