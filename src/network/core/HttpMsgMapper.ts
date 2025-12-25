import { HttpStatus } from './HttpCodes'

export const HttpMsgMap: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: '请求参数错误',
  [HttpStatus.UNAUTHORIZED]: '登录已过期，请重新登录',
  [HttpStatus.FORBIDDEN]: '没有权限访问',
  [HttpStatus.NOT_FOUND]: '接口不存在',
  [HttpStatus.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后再试',
  [HttpStatus.INTERNAL_SERVER_ERROR]: '服务器开小差了',
  [HttpStatus.BAD_GATEWAY]: '网关错误，请稍后再试',
  [HttpStatus.SERVICE_UNAVAILABLE]: '服务不可用，请稍后再试',
  [HttpStatus.GATEWAY_TIMEOUT]: '请求超时，请稍后再试',
}
