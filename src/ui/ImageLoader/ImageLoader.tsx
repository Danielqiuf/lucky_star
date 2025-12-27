/**
 * 图片加载容器
 * 支持网络图片，本地图片与设备系统图片加载
 * 支持占位loading，失败重试(指数退避)
 */
import {Image, View} from "@tarojs/components";
import Taro from "@tarojs/taro";

import {forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";

import {cx} from "@/ui";

import styles from './styles/image_loader.module.less'
import {SmartImageRef, SmartImageProps, RetryConfig, PrefetchConfig, Status} from "./types";

function isNetworkUrl(s: string) {
  return /^https?:\/\//i.test(s)
}

function addBustQuery(url: string, key: string, value: string) {
  const hasQuery = url.includes('?')
  const sep = hasQuery ? '&' : '?'
  return `${url}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`
}

const ImageLoader = memo(
  forwardRef<SmartImageRef, SmartImageProps>((props, ref) => {
    const {
      src,
      mode = 'aspectFill',
      className,
      style,

      lazyLoad = true,
      fadeIn = true,
      showMenuByLongpress,

      renderLoading,
      renderError,

      onError,
      onLoad,

      retryConfig,
      prefetch,

      emptyAsError = true,
    } = props

    const retryCfg = useMemo<Required<RetryConfig>>(() => ({
      maxRetries: retryConfig?.maxRetries ?? 3,
      baseDelayMs: retryConfig?.baseDelayMs ?? 400,
      maxDelayMs: retryConfig?.maxDelayMs ?? 8000,
      jitterRatio: retryConfig?.jitterRatio ?? 0.2,
      autoRetry: retryConfig?.autoRetry ?? true,
      bustCacheOnRetry: retryConfig?.bustCacheOnRetry ?? false,
      bustKey: retryConfig?.bustKey ?? '__img_retry',
    }), [
      retryConfig?.maxRetries,
      retryConfig?.baseDelayMs,
      retryConfig?.maxDelayMs,
      retryConfig?.jitterRatio,
      retryConfig?.autoRetry,
      retryConfig?.bustCacheOnRetry,
      retryConfig?.bustKey,
    ])

    const prefetchEnabled = prefetch?.enabled ?? false
    const prefetchHeader = useMemo(() => (prefetch?.header ?? {}), [prefetch?.header])

    const prefetchCfg: Required<PrefetchConfig> = {
      enabled: prefetch?.enabled ?? false,
      header: prefetch?.header ?? {},
    }

    const [status, setStatus] = useState<Status>('idle')
    const [displaySrc, setDisplaySrc] = useState<string>('')

    // 代数：忽略过期回调（比频繁 abort 更稳）
    const genRef = useRef(0)
    const retryCountRef = useRef(0)
    const timerRef = useRef<any>(null)

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const getEffectiveSrc = useCallback(() => {
      const raw = (src ?? '').trim()
      if (!raw) {return ''}
      if (!retryCfg.bustCacheOnRetry) {return raw}
      if (!isNetworkUrl(raw)) {return raw}
      if (retryCountRef.current <= 0) {return raw}
      return addBustQuery(raw, retryCfg.bustKey, String(Date.now()))
    }, [src, retryCfg.bustCacheOnRetry, retryCfg.bustKey])

    const startLoad = useCallback(
      async (_reason: 'init' | 'retry') => {
        clearTimer()
        const gen = ++genRef.current
        const effective = getEffectiveSrc()

        if (!effective) {
          setDisplaySrc('')
          setStatus(emptyAsError ? 'error' : 'idle')
          return
        }

        console.log('start loading')
        setStatus('loading')

        // 网络图预取
        if (prefetchEnabled && isNetworkUrl(effective)) {
          try {
            const res = await Taro.downloadFile({ url: effective, header: prefetchCfg.header })
            if (gen !== genRef.current) {return}

            if (res.statusCode === 200 && res.tempFilePath) {
              setDisplaySrc(res.tempFilePath)
              return
            }

            setDisplaySrc(effective)
            return
          } catch {
            if (gen !== genRef.current) {return}
            setDisplaySrc(effective)
            return
          }
        }

        setDisplaySrc(effective)
      },
      [emptyAsError, getEffectiveSrc, prefetchEnabled, prefetchHeader]
    )

    const doRetry = useCallback(() => {
      retryCountRef.current += 1
      startLoad('retry')
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startLoad])

    const scheduleRetry = useCallback(() => {
      if (!retryCfg.autoRetry) {return}
      if (retryCountRef.current >= retryCfg.maxRetries) {return}

      // 下次重试是第 retryCount+1 次
      const nextRetryIndex = retryCountRef.current + 1 // 1..maxRetries
      const exp = Math.max(0, nextRetryIndex - 1)
      const base = retryCfg.baseDelayMs * Math.pow(2, exp)
      const clamped = Math.min(retryCfg.maxDelayMs, base)

      const jitter = clamped * retryCfg.jitterRatio
      const delay = Math.max(0, Math.floor(clamped + (Math.random() * 2 - 1) * jitter))

      clearTimer()
      timerRef.current = setTimeout(() => doRetry(), delay)
    }, [doRetry, retryCfg])



    const reset = useCallback(() => {
      clearTimer()
      genRef.current += 1
      retryCountRef.current = 0
      setDisplaySrc('')
      setStatus('idle')
    }, [])

    useEffect(() => {
      clearTimer()
      genRef.current += 1
      retryCountRef.current = 0
      startLoad('init')
      return () => {
        clearTimer()
        genRef.current += 1
      }
    }, [src, startLoad])

    useImperativeHandle(
      ref,
      () => ({
        retry: doRetry,
        reset,
        getStatus: () => status,
      }),
      [doRetry, reset, status]
    )

    const loadingNode = useMemo(
      () =>
        renderLoading ?? (
          <View className={styles.loading}>
            <View className={styles.spinner} />
          </View>
        ),
      [renderLoading]
    )

    const errorNode = useMemo(() => {
      const retry = () => doRetry()
      const retryCount = retryCountRef.current
      return (
        <View className={styles.errorWrap} onClick={retry}>
          {renderError ? (
            renderError({ retry, retryCount })
          ) : (
            <View className={styles.error}>
              <View className={styles.errorTitle}>加载失败</View>
              <View className={styles.errorSub}>点击重试</View>
            </View>
          )}
        </View>
      )
    }, [doRetry, renderError])

    const handleLoad = useCallback(
      (e: any) => {
        clearTimer()
        setStatus('loaded')
        onLoad?.(e)
      },
      [onLoad]
    )

    const handleError = useCallback(
      (e: any) => {
        setStatus('error')
        onError?.(e)
        // 自动重试（指数退避）
        scheduleRetry()
      },
      [onError, scheduleRetry]
    )

    return (
      <View className={cx(styles.root, className)} style={style}>
        {!!displaySrc && (
          <Image
            className={styles.img}
            style={{ width: '100%', height: '100%' }}
            src={displaySrc}
            mode={mode as any}
            lazyLoad={lazyLoad}
            fadeIn={fadeIn}
            showMenuByLongpress={showMenuByLongpress}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {(status === 'idle' || status === 'loading') && (
          <View className={styles.mask}>{loadingNode}</View>
        )}

        {status === 'error' && <View className={styles.mask}>{errorNode}</View>}
      </View>
    )
  })
)

export default ImageLoader
