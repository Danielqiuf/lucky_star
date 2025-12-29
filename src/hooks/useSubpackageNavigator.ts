import Taro from '@tarojs/taro'

import { useCallback, useMemo, useRef, useState } from 'react'

type NavMethod = 'navigateTo' | 'redirectTo' | 'reLaunch'
type ToastMode = 'bottom' | 'native' // bottom=自定义底部toast；native=wx.showToast

export type UseSubpackageNavigatorOptions = {
  /** 分包名） */
  packageName: string
  /** 目标页面 url，如：/pkgA/pages/detail/index */
  url: string
  /** 跳转方式 */
  navMethod?: NavMethod

  /** Loading 文案（原生 showLoading 会用到） */
  loadingText?: string
  /** 是否优先用原生 showLoading（微信有） */
  useNativeLoading?: boolean

  /** 失败提示文案 */
  failText?: string
  /** toast 模式：默认 bottom（因为你要底部效果） */
  toastMode?: ToastMode
  /** toast 时长 */
  toastDuration?: number
}

/** 进度回调的数据结构（兼容 wx.loadSubpackage task） */
type ProgressPayload = { progress?: number } // progress: 0-100

const loadedPackages = new Set<string>()

export type SubpackageFeedbackState = {
  loadingVisible: boolean
  loadingText: string
  progress: number | null // 0-100
  toastVisible: boolean
  toastText: string
}

/**
 * const { run, feedback } = useSubpackageNavigator({
 *     packageName: 'pkgA',
 *     url: '/pkgA/pages/detail/index',
 *     // toastMode: 'native', // 想用原生普通 toast 就打开
 *     // useNativeLoading: true, // 默认 true（微信有 showLoading）:contentReference[oaicite:7]{index=7}
 *   })
 * @param options
 */
export function useSubpackageNavigator(options: UseSubpackageNavigatorOptions) {
  const {
    packageName,
    url,
    navMethod = 'navigateTo',
    loadingText = '加载中…',
    useNativeLoading = true,
    failText = '网络不佳，加载失败',
    toastMode = 'bottom',
    toastDuration = 2000,
  } = options

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState<number | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastText, setToastText] = useState('')
  const inFlightRef = useRef(false)
  const toastTimerRef = useRef<number | null>(null)

  const useWeappNativeLoading = useMemo(() => {
    // 微信侧有 showLoading/hideLoading（基础库支持），Taro 会映射
    return useNativeLoading && typeof Taro.showLoading === 'function' && typeof Taro.hideLoading === 'function'
  }, [useNativeLoading])

  const hideAnyLoading = useCallback(() => {
    if (useWeappNativeLoading) {
      try {
        Taro.hideLoading()
      } catch {}
    }
    setProgress(null)
  }, [useWeappNativeLoading])

  const showBottomToast = useCallback(
    (text: string) => {
      // 先关 loading，避免 toast / loading 互相顶掉:contentReference[oaicite:4]{index=4}
      hideAnyLoading()

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
        toastTimerRef.current = null
      }

      setToastText(text)
      setToastVisible(true)
      toastTimerRef.current = window.setTimeout(() => {
        setToastVisible(false)
        toastTimerRef.current = null
      }, toastDuration)
    },
    [hideAnyLoading, toastDuration]
  )

  const showNativeToast = useCallback(
    (text: string) => {
      // 原生 toast 不能设定“底部位置”，参数里也没有 position 字段:contentReference[oaicite:5]{index=5}
      hideAnyLoading()
      Taro.showToast({
        title: text,
        icon: 'none',
        duration: toastDuration,
      })
    },
    [hideAnyLoading, toastDuration]
  )

  const showFailToast = useCallback(
    (text: string) => {
      if (toastMode === 'native') {showNativeToast(text)}
      else {showBottomToast(text)}
    },
    [toastMode, showNativeToast, showBottomToast]
  )

  const showLoading = useCallback(() => {
    setProgress(null)
    if (useWeappNativeLoading) {
      Taro.showLoading({ title: loadingText, mask: true })
    }
    // 不用原生时由组件渲染 loading overlay（见下方 SubpackageFeedback）
  }, [useWeappNativeLoading, loadingText])

  const loadSubPackage = useCallback(async () => {
    if (loadedPackages.has(packageName)) {return}

    await new Promise<void>((resolve, reject) => {
      // Taro.loadSubPackage 底层对应 wx.loadSubpackage，返回 task 可监听进度:contentReference[oaicite:6]{index=6}
      const task: any = (Taro as any).loadSubPackage({
        name: packageName,
        success: () => resolve(),
        fail: (err: any) => reject(err),
      })

      if (task && typeof task.onProgressUpdate === 'function') {
        task.onProgressUpdate((p: ProgressPayload) => {
          const val = typeof p?.progress === 'number' ? p.progress : null
          if (val !== null) {setProgress(val)}
        })
      }
    })

    loadedPackages.add(packageName)
  }, [packageName])

  const navigate = useCallback(async () => {
    const fn = (Taro as any)[navMethod]
    if (typeof fn !== 'function') {
      throw new Error(`Unsupported navMethod: ${navMethod}`)
    }
    await fn({ url })
  }, [navMethod, url])

  const run = useCallback(async () => {
    if (inFlightRef.current) {return}
    inFlightRef.current = true

    try {
      setStatus('loading')
      showLoading()

      await loadSubPackage()
      hideAnyLoading()

      setStatus('success')
      await navigate()
    } catch (e) {
      setStatus('error')
      showFailToast(failText)
      throw e
    } finally {
      inFlightRef.current = false
    }
  }, [showLoading, loadSubPackage, hideAnyLoading, navigate, showFailToast, failText])

  const feedback: SubpackageFeedbackState = useMemo(
    () => ({
      loadingVisible: status === 'loading' && !useWeappNativeLoading,
      loadingText,
      progress,
      toastVisible,
      toastText,
    }),
    [status, useWeappNativeLoading, loadingText, progress, toastVisible, toastText]
  )

  return { run, status, progress, feedback }
}
