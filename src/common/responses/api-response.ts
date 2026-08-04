export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export function successResponse<T>(data: T, message = 'Success'): ApiSuccessResponse<T> {
  return { success: true, data, message };
}
