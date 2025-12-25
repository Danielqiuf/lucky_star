import { WechatLoginReq, WechatLoginDTO } from '@/network'

import { Endpoint } from '../core/endpoint'

import type { ApiClient } from '../core/ApiClient'
import type { RequestMeta } from '../core/types'

export class AuthRepo {
  constructor(private api: ApiClient) {}

  wechatLogin(req: WechatLoginReq, meta?: RequestMeta) {
    const url = Endpoint.build('v1', 'login', 'wechat_login')
    return this.api.requestEnvelope<WechatLoginDTO>({
      method: 'POST',
      url,
      body: req,
      meta: {
        withAuth: false,       // 登录接口通常不带 token
        toastOnError: true,
        ...meta,
      },
    })
  }
}
