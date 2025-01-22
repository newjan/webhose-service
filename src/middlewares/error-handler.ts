import { NextFunction, Request, Response } from 'express';
import { ApiError, ServerError } from '@/common/exceptions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/max-params
function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  const apiError = error instanceof ApiError ? error : new ServerError();

  return response.status(apiError.statusCode).json({
    statusCode: apiError.statusCode,
    message: apiError.message,
    location: apiError.location,
    fieldErrors: apiError.fieldErrors,
    errorStack: apiError.statusCode >= 500 ? error.stack : undefined,
  });``
}

export default errorHandler;
