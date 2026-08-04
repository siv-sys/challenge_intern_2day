import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUsername,
  password: env.dbPassword,
  database: env.dbDatabase,
  // Schema is owned by migrations, not runtime sync — see src/migrations/.
  synchronize: false,
  logging: false,
  entities: [User, Task],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  subscribers: [],
});
