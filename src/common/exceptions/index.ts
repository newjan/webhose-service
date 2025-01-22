import { StatusCodes } from 'http-status-codes';

export type ErrorLocation = 'params' | 'body' | 'query';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly fieldErrors: Record<string, string> | undefined;
  public readonly location: ErrorLocation | undefined;

  constructor({
    message,
    statusCode,
    fieldErrors,
    location,
  }: {
    message: string;
    statusCode: number;
    fieldErrors?: Record<string, string>;
    location?: ErrorLocation;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    this.location = location;
  }
}

export class ValidationError extends ApiError {
  constructor(fieldErrors: Record<string, string>, location: ErrorLocation) {
    super({
      message: 'Validation Error',
      statusCode: StatusCodes.BAD_REQUEST,
      fieldErrors,
      location,
    });
  }
}

export class BadRequest extends ApiError {
  constructor(message: string) {
    super({ message, statusCode: StatusCodes.BAD_REQUEST });
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super({ message, statusCode: StatusCodes.NOT_FOUND });
  }
}

export class NotAuthenticatedError extends ApiError {
  constructor(message = 'Not Authenticated') {
    super({ message, statusCode: StatusCodes.UNAUTHORIZED });
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super({ message, statusCode: StatusCodes.FORBIDDEN });
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super({ message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
