export type ErrorKind =
  | 'NetworkOffline'
  | 'Timeout'
  | 'HttpError'
  | 'BizError'
  | 'ParseError'
  | 'Unknown'

export class AppError extends Error {
  kind: ErrorKind
  httpStatus?: number
  bizCode?: number
  traceId?: string
  raw?: any

  constructor(message: string, opts: Partial<AppError> = {}) {
    super(message)
    this.name = 'AppError'
    this.kind = opts.kind ?? 'Unknown'
    this.httpStatus = opts.httpStatus
    this.bizCode = opts.bizCode
    this.traceId = opts.traceId
    this.raw = opts.raw
  }
}
