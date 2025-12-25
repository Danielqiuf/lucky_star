import Taro from '@tarojs/taro'

export class NetworkService {
  private online: boolean | null = null

  constructor() {
    // 监听网络变化（小程序可用）
    try {
      Taro.onNetworkStatusChange((res) => {
        this.online = res.isConnected
      })
    } catch {
      // ignore
    }
  }

  async isOnline(): Promise<boolean> {
    if (this.online !== null) {return this.online}
    try {
      const res = await Taro.getNetworkType()
      this.online = res.networkType !== 'none'
      return this.online
    } catch {
      // 无法判断就当在线，让请求走到 fail
      return true
    }
  }
}
