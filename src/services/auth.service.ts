import { ConflictError, UnauthorizedError } from '../common/errors/http-error';
import { User } from '../entities/user.entity';
import { userRepository } from '../repositories/user.repository';
import { comparePassword, hashPassword } from '../utils/password.util';
import { signAccessToken } from '../utils/jwt.util';

export type SafeUser = Omit<User, 'password' | 'tasks'>;

function toSafeUser(user: User): SafeUser {
  const { password: _password, tasks: _tasks, ...safeUser } = user;
  return safeUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: SafeUser;
  token: string;
}

export const authService = {
  async register(input: RegisterInput): Promise<SafeUser> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    const hashedPassword = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    return toSafeUser(user);
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const invalidCredentialsError = new UnauthorizedError('Invalid email or password');

    const user = await userRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw invalidCredentialsError;
    }

    const passwordMatches = await comparePassword(input.password, user.password);
    if (!passwordMatches) {
      throw invalidCredentialsError;
    }

    const token = signAccessToken({ userId: user.id, email: user.email });
    return { user: toSafeUser(user), token };
  },

  async getMe(userId: number): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }
    return toSafeUser(user);
  },
};
