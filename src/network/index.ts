import {HttpModule} from "@/network/di/NetworkModule";

export * from './dto'
export * from './repo'
export * from './core/types'
export * from './core/BaseViewModel';
export * from './core/CancelScope';

export const http = new HttpModule({
  baseURL: 'https://api.test.com',
  tokenProvider: {
    getToken: () => 'fake token',
    onAuthInvalid: () => {
      // @TODO 这里做全局登出/清理/跳转
    }
  }
})
