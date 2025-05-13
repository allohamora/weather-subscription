/*
    This is a set of application-specific error codes that can be used to identify
    different types of errors that may occur in the application.

    Basic set includes just enough error codes to map them to most common HTTP status codes.

    Usage of AppError + AppErrorCode is a replacement for polluting the code with a separate class
    for each error type (Java-style).
*/
export const enum AppErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  NOT_FOUND = 'NOT_FOUND',
  SOMETHING_WENT_WRONG = 'SOMETHING_WENT_WRONG',
}

export class AppError extends Error {
  public code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);

    this.code = code;
  }

  public static fromCode(code: AppErrorCode, message: string) {
    return new AppError(code, message);
  }

  public toHttpCode() {
    switch (this.code) {
      case AppErrorCode.VALIDATION_FAILED:
        return 400;
      case AppErrorCode.NOT_FOUND:
        return 404;
      case AppErrorCode.SOMETHING_WENT_WRONG:
        return 500;
      default:
        return 500;
    }
  }
}
