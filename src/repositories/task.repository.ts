import { FindOptionsOrder, FindOptionsWhere, Like } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Task, TaskStatus } from '../entities/task.entity';
import { TaskSortableField } from '../dtos/common/pagination-query.dto';

const ormRepository = AppDataSource.getRepository(Task);

export interface FindTasksParams {
  userId: number;
  skip: number;
  take: number;
  sortBy: TaskSortableField;
  sortOrder: 'ASC' | 'DESC';
  status?: TaskStatus;
  search?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
  userId: number;
}

export type UpdateTaskData = Partial<Omit<CreateTaskData, 'userId'>>;

export const taskRepository = {
  async findAndCountByUser(params: FindTasksParams): Promise<[Task[], number]> {
    const where: FindOptionsWhere<Task> = { userId: params.userId };
    if (params.status) {
      where.status = params.status;
    }
    if (params.search) {
      where.title = Like(`%${params.search}%`);
    }

    const order: FindOptionsOrder<Task> = { [params.sortBy]: params.sortOrder };

    return ormRepository.findAndCount({
      where,
      order,
      skip: params.skip,
      take: params.take,
    });
  },

  async findByIdAndUser(id: number, userId: number): Promise<Task | null> {
    return ormRepository.findOne({ where: { id, userId } });
  },

  async create(data: CreateTaskData): Promise<Task> {
    const task = ormRepository.create(data);
    return ormRepository.save(task);
  },

  async save(task: Task): Promise<Task> {
    return ormRepository.save(task);
  },

  async remove(task: Task): Promise<void> {
    await ormRepository.remove(task);
  },
};
