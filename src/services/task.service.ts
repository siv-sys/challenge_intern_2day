import { NotFoundError } from '../common/errors/http-error';
import { Task, TaskStatus } from '../entities/task.entity';
import { PaginationQueryDto } from '../dtos/common/pagination-query.dto';
import { taskRepository } from '../repositories/task.repository';

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface ListTasksResult {
  tasks: Task[];
  total: number;
}

async function getOwnedTaskOrThrow(userId: number, id: number): Promise<Task> {
  const task = await taskRepository.findByIdAndUser(id, userId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return task;
}

export const taskService = {
  async list(userId: number, query: PaginationQueryDto): Promise<ListTasksResult> {
    const skip = (query.page - 1) * query.limit;
    const [tasks, total] = await taskRepository.findAndCountByUser({
      userId,
      skip,
      take: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      status: query.status,
      search: query.search,
      // Only active tasks are returned by default (soft-delete).
      isActive: true,
    });
    return { tasks, total };
  },

  async getById(userId: number, id: number): Promise<Task> {
    return getOwnedTaskOrThrow(userId, id);
  },

  async create(userId: number, input: CreateTaskInput): Promise<Task> {
    return taskRepository.create({
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      dueDate: input.dueDate ?? null,
      userId,
    });
  },

  async update(userId: number, id: number, input: UpdateTaskInput): Promise<Task> {
    const task = await getOwnedTaskOrThrow(userId, id);

    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.status !== undefined) task.status = input.status;
    if (input.dueDate !== undefined) task.dueDate = input.dueDate;

    return taskRepository.save(task);
  },

  /**
   * Soft-delete: hides the task from all normal lists by flipping
   * `isActive` to `false`. The record remains in the database.
   */
  async delete(userId: number, id: number): Promise<Task> {
    const task = await getOwnedTaskOrThrow(userId, id);
    return taskRepository.softDelete(task);
  },

  /**
   * Restore a soft-deleted task (future-ready). Flipping `isActive`
   * back to `true` brings it back into normal lists.
   */
  async restore(userId: number, id: number): Promise<Task> {
    const task = await taskRepository.findByIdAndUserIncludingInactive(id, userId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return taskRepository.restore(task);
  },

  /**
   * Permanent delete — the row is removed from the database.
   * Intended for admin-only operations in future releases.
   */
  async hardDelete(userId: number, id: number): Promise<void> {
    const task = await taskRepository.findByIdAndUserIncludingInactive(id, userId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    await taskRepository.hardDelete(task);
  },
};