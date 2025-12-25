import { BizCode } from './BizCodes'

export const BizMsgMap: Record<number, string> = {
  [BizCode.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [BizCode.TOKEN_INVALID]: '登录状态无效，请重新登录',
  [BizCode.PARAM_INVALID]: '参数错误，请检查后重试',
  [BizCode.SERVER_BUSY]: '系统繁忙，请稍后再试',
}
