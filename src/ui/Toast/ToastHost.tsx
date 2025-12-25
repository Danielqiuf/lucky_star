import {View, Text, RootPortal} from '@tarojs/components'

import {useEffect, useMemo, useRef, useState} from 'react'

import {toastFactory} from "@/ui";

import styles from './styles/toast.module.less'
import {Phase, ToastShowOptions} from './types'

const OUT_MS = 220

const DEFAULTS: Required<Pick<ToastShowOptions, 'duration' | 'placement'>> = {
  duration: 2000,
  placement: 'center',
}

export default function ToastHost() {
  const [phase, setPhase] = useState<Phase>('hidden')
  const [current, setCurrent] = useState<ToastShowOptions | null>(null)

  const phaseRef = useRef<Phase>('hidden')
  // 频繁 show 时：新的覆盖旧的，等旧的 leave 完再 enter
  const pendingRef = useRef<ToastShowOptions | null>(null)

  const autoTimerRef = useRef<any>(null)
  const leaveTimerRef = useRef<any>(null)

  const clearTimers = () => {
    if (autoTimerRef.current) {clearTimeout(autoTimerRef.current)}
    if (leaveTimerRef.current) {clearTimeout(leaveTimerRef.current)}
    autoTimerRef.current = null
    leaveTimerRef.current = null
  }

  const startEnter = (opts: ToastShowOptions) => {
    clearTimers()
    setCurrent(opts)
    setPhase('enter')

    const duration = opts.duration ?? DEFAULTS.duration
    if (duration > 0) {
      autoTimerRef.current = setTimeout(() => {
        // 自动关闭：走 leave，并且不保留 pending
        pendingRef.current = null
        startLeave()
      }, duration)
    }
  }

  const startLeave = () => {
    const p = phaseRef.current
    // 已经隐藏 or 正在 leave，不重复触发
    if (p === 'hidden' || p === 'leave') {return}

    // 进入 leave
    clearTimers()
    setPhase('leave')

    // 等退场动画结束
    leaveTimerRef.current = setTimeout(() => {
      setPhase('hidden')

      // leave 结束后如果有 pending（频繁 show 覆盖后的“最后一个”），再 enter
      const next = pendingRef.current
      pendingRef.current = null
      if (next) {startEnter(next)}
      else {setCurrent(null)}
    }, OUT_MS)
  }

  useEffect(() => { phaseRef.current = phase }, [phase])

  useEffect(() => {
    const unsub = toastFactory._subscribe((cmd) => {
      if (cmd.type === 'hide') {
        pendingRef.current = null
        startLeave()
        return
      }

      const merged = { duration: DEFAULTS.duration, placement: DEFAULTS.placement, ...cmd.payload }
      const p = phaseRef.current
      if (p === 'hidden') {
        startEnter(merged)
      } else {
        pendingRef.current = merged
        startLeave()
      }
    })

    return () => {
      unsub()
      clearTimers()
    }
  }, [])

  const placement = current?.placement ?? DEFAULTS.placement
  const placeCls =
    placement === 'top' ? styles.top : placement === 'bottom' ? styles.bottom : styles.center

  const cssVars = useMemo(() => {
    const s: Record<string, string> = {}
    if (current?.bgColor) {s['--toast-bg'] = current.bgColor}
    if (current?.textColor) {s['--toast-color'] = current.textColor}
    return s
  }, [current?.bgColor, current?.textColor])

  if (phase === 'hidden' || !current) {return null}


  return (
    <RootPortal>
      <View className={`${styles.mask} ${placeCls}`}>
        <View
          className={`${styles.toast} ${phase === 'leave' ? styles.leave : styles.enter}`}
          style={cssVars as any}
        >
          <Text>{current.message}</Text>
        </View>
      </View>
    </RootPortal>
  )
}
