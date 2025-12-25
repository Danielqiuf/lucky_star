export class HttpStatus {
  static readonly OK = 200
  static readonly BAD_REQUEST = 400
  static readonly UNAUTHORIZED = 401
  static readonly FORBIDDEN = 403
  static readonly NOT_FOUND = 404
  static readonly TOO_MANY_REQUESTS = 429
  static readonly INTERNAL_SERVER_ERROR = 500
  static readonly BAD_GATEWAY = 502
  static readonly SERVICE_UNAVAILABLE = 503
  static readonly GATEWAY_TIMEOUT = 504
}
