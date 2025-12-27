import Taro, {
  getCurrentInstance,
  useDidShow,
  useDidHide,
  useUnload,
  usePageScroll,
} from '@tarojs/taro'

import { useMemo, useRef } from 'react'

const scrollMem = new Map<string, number>()

function getRouteKey(extraKey?: string) {
  const path = getCurrentInstance().router?.path ?? 'unknown'
  return extraKey ? `${path}::${extraKey}` : path
}

/**
 * 记录并恢复「页面滚动」（不是 ScrollView 内部滚动）
 */
export default function useScrollMemory(extraKey?: string) {
  const key = useMemo(() => getRouteKey(extraKey), [extraKey])
  const lastTopRef = useRef(0)
  const restoredRef = useRef(false)

  // 实时记录页面 scrollTop
  usePageScroll((e) => {
    lastTopRef.current = e.scrollTop ?? 0
  })

  const save = () => {
    scrollMem.set(key, lastTopRef.current)
  }

  const restore = () => {
    if (restoredRef.current) {return}
    restoredRef.current = true

    const saved = scrollMem.get(key)
    if (saved === undefined) {return}

    // 等页面渲染完再滚（更稳）
    Taro.nextTick(() => {
      Taro.pageScrollTo({ scrollTop: saved, duration: 0 })
    })
  }

  useDidShow(() => restore())
  useDidHide(() => save())
  useUnload(() => save())
}
