import { HTTPException } from 'hono/http-exception';

/*
  This is a set of application-specific exception codes that can be used to identify
  different types of exceptions that may occur in the application.

  Usage of Exception + ExceptionCode is a replacement for polluting the code with a separate class
  for each error type (Java-style).
*/
export const enum ExceptionCode {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
}

export const toHttpCode = (code: ExceptionCode) => {
  switch (code) {
    case ExceptionCode.NOT_FOUND:
      return 404;
    case ExceptionCode.VALIDATION_ERROR:
      return 400;
    case ExceptionCode.ALREADY_EXISTS:
      return 409;
    case ExceptionCode.INTERNAL_SERVER_ERROR:
    default:
      return 500;
  }
};

export class Exception extends HTTPException {
  public code: ExceptionCode;

  constructor(code: ExceptionCode, message: string) {
    super(toHttpCode(code), { message });

    this.code = code;
  }
}
