export const enum HttpCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export class HttpError extends Error {
  public httpCode: HttpCode;

  constructor(code: HttpCode, message: string) {
    super(message);

    this.httpCode = code;
  }
}

export const BadRequest = (message = 'Bad Request') => {
  return new HttpError(HttpCode.BAD_REQUEST, message);
};

export const NotFound = (message = 'Not Found') => {
  return new HttpError(HttpCode.NOT_FOUND, message);
};

export const UnprocessableEntity = (message = 'Unprocessable Entity') => {
  return new HttpError(HttpCode.UNPROCESSABLE_ENTITY, message);
};

export const InternalServerError = (message = 'Internal Server Error') => {
  return new HttpError(HttpCode.INTERNAL_SERVER_ERROR, message);
};
