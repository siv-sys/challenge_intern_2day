export type ValidationErrorMap = Record<string, string[]>;

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly errors?: ValidationErrorMap;

  constructor(statusCode: number, message: string, errors?: ValidationErrorMap) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request', errors?: ValidationErrorMap) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}
