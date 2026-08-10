import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalNumber(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: optionalNumber('PORT', 3000),

  dbHost: required('DB_HOST'),
  dbPort: optionalNumber('DB_PORT', 3306),
  dbUsername: required('DB_USERNAME'),
  dbPassword: required('DB_PASSWORD'),
  dbDatabase: required('DB_DATABASE'),

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',

  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
} as const;

export const isProduction = env.nodeEnv === 'production';
