import Taro from '@tarojs/taro'

import { useState } from 'react'

type RippleItem = {
  key: string
  left: number
  top: number
  size: number
}

function getPoint(e: any) {
  const t =
    (e?.touches && e.touches[0]) ||
    (e?.changedTouches && e.changedTouches[0]) ||
    e
  return { x: t?.clientX ?? 0, y: t?.clientY ?? 0 }
}

/**
 * 水波纹效果
 * @param options
 */
export function useRipple(options: { enabled: boolean; hostId: string; duration?: number }) {
  const { enabled, hostId, duration = 520 } = options
  const [ripples, setRipples] = useState<RippleItem[]>([])

  const addRipple = async (e: any) => {
    if (!enabled) {return}

    const { x, y } = getPoint(e)

    const rect = await new Promise<any>((resolve) => {
      Taro.createSelectorQuery()
        .select(`#${hostId}`)
        .boundingClientRect((r) => resolve(r))
        .exec()
    })

    if (!rect) {return}

    const size = Math.max(rect.width, rect.height) * 2
    const left = x - rect.left - size / 2
    const top = y - rect.top - size / 2
    const key = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    setRipples((prev) => [...prev, { key, left, top, size }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((it) => it.key !== key))
    }, duration)
  }

  return { ripples, addRipple }
}
