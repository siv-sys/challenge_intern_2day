import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';

const ormRepository = AppDataSource.getRepository(User);

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return ormRepository.findOne({ where: { email } });
  },

  /** Explicitly re-adds the `password` column, which is excluded by default via `select: false`. */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return ormRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  },

  async findById(id: number): Promise<User | null> {
    return ormRepository.findOne({ where: { id } });
  },

  async create(data: CreateUserData): Promise<User> {
    const user = ormRepository.create(data);
    return ormRepository.save(user);
  },
};
