import Taro from '@tarojs/taro'

import { useEffect, useState } from 'react'

export type NetworkStatus = {
  isConnected: boolean
  networkType: string
}

/**
 * 网络状态（断网提示、弱网降级）
 */
export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    networkType: 'unknown',
  })

  useEffect(() => {
    let off: (() => void) | null = null

    // 初始化
    Taro.getNetworkType()
      .then((res) => setStatus({ isConnected: res.networkType !== 'none', networkType: res.networkType }))
      .catch(() => {})

    try {
      const handler = (res: any) => setStatus({ isConnected: !!res.isConnected, networkType: res.networkType })
      Taro.onNetworkStatusChange(handler)
      off = () => {
        try {
          // taro 里一般没有 offNetworkStatusChange，微信原生也没有统一 off，保守处理
        } catch {}
      }
    } catch {}

    return () => off?.()
  }, [])

  return status
}
