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
  /** When `true`, only active tasks are returned. When `false`, only inactive (soft-deleted) tasks. */
  isActive?: boolean;
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

    // Only return active tasks by default; allow explicit filtering for
    // inactive (soft-deleted) tasks when requested.
    where.isActive = params.isActive ?? true;

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
    return ormRepository.findOne({ where: { id, userId, isActive: true } });
  },

  /** Finds a task regardless of its `isActive` state — used for restore / admin operations. */
  async findByIdAndUserIncludingInactive(id: number, userId: number): Promise<Task | null> {
    return ormRepository.findOne({ where: { id, userId } });
  },

  async create(data: CreateTaskData): Promise<Task> {
    const task = ormRepository.create(data);
    return ormRepository.save(task);
  },

  async save(task: Task): Promise<Task> {
    return ormRepository.save(task);
  },

  /** Soft-delete: flips `isActive` to `false` instead of removing the row. */
  async softDelete(task: Task): Promise<Task> {
    task.isActive = false;
    return ormRepository.save(task);
  },

  /** Restore a soft-deleted task by flipping `isActive` back to `true`. */
  async restore(task: Task): Promise<Task> {
    task.isActive = true;
    return ormRepository.save(task);
  },

  /** Permanently removes the row from the database (admin-only future use). */
  async hardDelete(task: Task): Promise<void> {
    await ormRepository.remove(task);
  },
};