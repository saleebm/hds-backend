export class KnownError extends Error {
  constructor(
    public code: string,
    public status: number = 400,
    public message: string = ''
  ) {
    super(code)
  }
}

export class NotAdminError extends KnownError {
  constructor() {
    super('NotAdmin')
  }
}

export class InvalidCodeError extends KnownError {
  constructor() {
    super('InvalidCode')
  }
}

export class NoAuthorizationHeaderError extends KnownError {
  constructor() {
    super('NoAuthorizationHeader')
  }
}

export class MalformedAuthorizationHeaderError extends KnownError {
  constructor() {
    super('MalformedAuthorizationHeader')
  }
}

export class MissingParameterError extends KnownError {
  constructor() {
    super('MissingParameters')
  }
}

export class NotImplementedError extends KnownError {
  constructor() {
    super('NotImplementedError', 501)
  }
}

export class UnauthenticatedError extends KnownError {
  constructor() {
    super('Unauthenticated', 401)
  }
}

export class FailedLoginError extends KnownError {
  constructor() {
    super('Unauthenticated', 401, 'Wrong username or password')
  }
}
export class UnsupportedMethodError extends KnownError {
  constructor() {
    super('UnsupportedMethod')
  }
}

export class InvalidArgumentError extends KnownError {
  constructor(invalidArgErrorMessage: string) {
    super('InvalidArgument', 400, invalidArgErrorMessage)
  }
}

export class NotFoundError extends KnownError {
  constructor() {
    super('NotFoundError', 404)
  }
}

export function isKnownError(error: any): error is KnownError {
  return !!error.code && !!error.status
}

type AKnownError = typeof NotFoundError | typeof UnauthenticatedError

export function isKnownErrorOfType(
  error: KnownError,
  aKnownError: AKnownError
): boolean {
  return error.code === new aKnownError().code
}
