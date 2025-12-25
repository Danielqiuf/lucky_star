import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { RequestMeta, BaseViewModel } from '@/network'

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

type UseRequestOptions<P> = {
  auto?: boolean
  deps?: any[]
  /** 默认 true,再 run时取消同hook的上一次请求 */
  cancelPrev?: boolean
  /** hook 默认 meta,每次run可覆盖 */
  meta?: RequestMeta
  /** 自动请求时的默认参数 */
  autoParams?: P
}

type Service<P, R> = (params: P, meta?: RequestMeta) => Promise<R>

/**
 * 基于MVVM模型发起请求
 * @example ```
 * const userReq = useRequestVM(
 *     vm,
 *     (p: { userId: string }, meta) => http.userRepo.getUserInfo({ userId: p.userId }, meta),
 *     {
 *       auto: true,
 *       autoParams: { userId: '123' },
 *       deps: ['123'],
 *       meta: {
 *         log: true,
 *         throttle: { gapMs: 300, key: 'user' },
 *         retry: { times: 1, intervalMs: 300 },
 *       },
 *     }
 *   )```
 * @param vm
 * @param service
 * @param options
 */
export function useRequestVM<P, R>(
  vm: BaseViewModel,
  service: Service<P, R>,
  options: UseRequestOptions<P> = {}
) {
  const {
    auto = true,
    deps = [],
    cancelPrev = true,
    meta: defaultMeta,
    autoParams,
  } = options

  const [data, setData] = useState<R | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')

  const loading = status === 'loading'

  // 用于 keepLatest,只更新最后一次 run 的结果
  const seqRef = useRef(0)
  const hookId = useMemo(() => `REQ_${Date.now()}_${Math.random().toString(16).slice(2)}`, [])
  const group = hookId // 同一个 hook 的请求放同一组，方便 cancelPrev

  const cancel = useCallback(() => {
    vm.cancelScope.cancelGroup(group)
    setStatus('idle')
  }, [vm, group])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setStatus('idle')
  }, [])

  const run = useCallback(
    async (params: P, meta?: RequestMeta): Promise<R | undefined> => {
      if (cancelPrev) {vm.cancelScope.cancelGroup(group)}

      const seq = ++seqRef.current
      setStatus('loading')
      setError(null)

      const mergedMeta: RequestMeta = {
        ...(defaultMeta ?? {}),
        ...(meta ?? {}),
        cancelScope: vm.cancelScope,
        cancelGroup: group,
      }

      try {
        const res = await service(params, mergedMeta)
        // 只接受最后一次 run 的结果
        if (seq === seqRef.current) {
          setData(res)
          setStatus('success')
        }
        return res
      } catch (e: any) {
        if (seq === seqRef.current) {
          setError(e instanceof Error ? e : new Error(String(e)))
          setStatus('error')
        }
        return undefined
      }
    },
    [service, vm, group, cancelPrev, defaultMeta]
  )

  // auto run
  useEffect(() => {
    if (!auto) {return}
    if (autoParams === undefined) {return}
    run(autoParams as P).then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, ...deps])

  return {
    data,
    error,
    status,
    loading,
    run,
    cancel,
    reset,
  }
}
