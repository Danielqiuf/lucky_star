import { AuthRepo } from '@/network'

import { ApiClient } from '../core/ApiClient'
import { NetworkService } from '../core/NetworkService'
import { ThrottleManager } from '../core/ThrottleManager'
import { createAuth, type TokenProvider } from '../middlewares/Authorization'
import { createRetry } from '../middlewares/FailedRetry'
import { createLogger } from '../middlewares/Logger'
import { createNetworkGuard } from '../middlewares/NetworkGuard'
import { createResponseHandler } from '../middlewares/NetworkResponse'
import { createThrottle } from '../middlewares/NetworkThrottle'

export type HttpModuleConfig = {
  baseURL: string
  tokenProvider: TokenProvider
  timeoutMs?: number
}

export class HttpModule {
  api: ApiClient
  authRepo: AuthRepo

  constructor(cfg: HttpModuleConfig) {
    const net = new NetworkService()
    const throttle = new ThrottleManager()

    const middlewares = [
      createNetworkGuard(net),
      createThrottle(throttle),
      createRetry(),
      createAuth(cfg.tokenProvider),
      createLogger(),
      createResponseHandler(cfg.tokenProvider),
    ]

    this.api = new ApiClient({
      baseURL: cfg.baseURL,
      timeoutMs: cfg.timeoutMs ?? 15000,
      middlewares,
    })

    this.authRepo = new AuthRepo(this.api)
  }
}
