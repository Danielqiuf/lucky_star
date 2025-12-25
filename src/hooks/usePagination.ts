import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type PageResult<T> = {
  list: T[]
  total?: number
  hasMore?: boolean
  nextPage?: number
}

export type PaginationState<T> = {
  list: T[]
  page: number
  pageSize: number
  total?: number
  hasMore: boolean
  refreshing: boolean
  loadingMore: boolean
  error: Error | null
}

type Options<P> = {
  /** 初始页码，默认是1 */
  initialPage?: number
  pageSize?: number
  /** 自动首刷 */
  auto?: boolean
  /** auto 时的参数 */
  autoParams?: P
  /** 用 total 计算 hasMore（默认 true）。如果接口直接给 hasMore，可关掉 */
  useTotalToCalcHasMore?: boolean
}

type Fetcher<P, T> = (args: { page: number; pageSize: number; params: P }) => Promise<PageResult<T>>

/**
 * 分页列表（refresh / loadMore / hasMore / 状态分离）
 * 兼容自动首刷或手动
 * 明确区分：refreshing / loadingMore
 * 支持 reset() / reload() / setList()
 * 支持 useReachBottom/usePullDownRefresh 直接接入
 * 支持防重复并发，刷新中不允许 loadMore，loadMore 中不允许刷新
 * @example ```
 * const pager = usePagination(
 *     async ({ page, pageSize, params }) => {
 *       const res = await fetchList({ page, pageSize, keyword: params.keyword })
 *       return { list: res.list, total: res.total }
 *     },
 *     { auto: true, autoParams: { keyword: '' }, pageSize: 20 }
 *   )
 *
 *   usePullDownRefresh(async () => {
 *     await pager.refresh({ keyword: '' })
 *   })
 *
 *   useReachBottom(() => {
 *     pager.loadMore()
 *   })
 *
 *   if (pager.status === 'loading') return <View>Loading...</View>
 *   if (pager.status === 'error') return <View>错误：{pager.error?.message}</View>
 *
 *   return <View>{/* render pager.list </view>
 * ```
 * @param fetcher
 * @param opts
 */
export function usePagination<P, T>(fetcher: Fetcher<P, T>, opts: Options<P> = {}) {
  const {
    initialPage = 1,
    pageSize = 20,
    auto = true,
    autoParams,
    useTotalToCalcHasMore = true,
  } = opts

  const [state, setState] = useState<PaginationState<T>>({
    list: [],
    page: initialPage,
    pageSize,
    total: undefined,
    hasMore: true,
    refreshing: false,
    loadingMore: false,
    error: null,
  })

  const paramsRef = useRef<P | undefined>(autoParams)
  const busyRef = useRef(false)

  const calcHasMore = useCallback(
    (listLen: number, total?: number, serverHasMore?: boolean) => {
      if (typeof serverHasMore === 'boolean') {return serverHasMore}
      if (!useTotalToCalcHasMore) {return true}
      if (typeof total !== 'number') {return true}
      return listLen < total
    },
    [useTotalToCalcHasMore]
  )

  const setList = useCallback((list: T[]) => {
    setState((s) => ({
      ...s,
      list,
      hasMore: calcHasMore(list.length, s.total, s.hasMore),
    }))
  }, [calcHasMore])

  const reset = useCallback(() => {
    busyRef.current = false
    setState((s) => ({
      ...s,
      list: [],
      page: initialPage,
      total: undefined,
      hasMore: true,
      refreshing: false,
      loadingMore: false,
      error: null,
    }))
  }, [initialPage])

  const refresh = useCallback(
    async (params?: P) => {
      if (busyRef.current) {return}
      busyRef.current = true

      paramsRef.current = params ?? paramsRef.current
      setState((s) => ({ ...s, refreshing: true, loadingMore: false, error: null }))

      try {
        const p = paramsRef.current as P
        const res = await fetcher({ page: initialPage, pageSize, params: p })

        const mergedList = res.list ?? []
        const total = res.total
        const hasMore = calcHasMore(mergedList.length, total, res.hasMore)

        setState((s) => ({
          ...s,
          list: mergedList,
          page: res.nextPage ?? initialPage + 1,
          total,
          hasMore,
          refreshing: false,
          loadingMore: false,
          error: null,
        }))
      } catch (e: any) {
        setState((s) => ({
          ...s,
          refreshing: false,
          loadingMore: false,
          error: e instanceof Error ? e : new Error(String(e)),
        }))
      } finally {
        busyRef.current = false
      }
    },
    [fetcher, initialPage, pageSize, calcHasMore]
  )

  const loadMore = useCallback(async () => {
    if (busyRef.current) {return}
    if (!state.hasMore) {return}
    if (!paramsRef.current) {return}

    busyRef.current = true
    setState((s) => ({ ...s, loadingMore: true, error: null }))

    try {
      const res = await fetcher({
        page: state.page,
        pageSize: state.pageSize,
        params: paramsRef.current as P,
      })

      const nextList = [...state.list, ...(res.list ?? [])]
      const total = typeof res.total === 'number' ? res.total : state.total
      const hasMore = calcHasMore(nextList.length, total, res.hasMore)

      setState((s) => ({
        ...s,
        list: nextList,
        page: res.nextPage ?? s.page + 1,
        total,
        hasMore,
        loadingMore: false,
        error: null,
      }))
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loadingMore: false,
        error: e instanceof Error ? e : new Error(String(e)),
      }))
    } finally {
      busyRef.current = false
    }
  }, [fetcher, state, calcHasMore])

  const reload = useCallback(async () => {
    await refresh(paramsRef.current)
  }, [refresh])

  const status = useMemo(() => {
    if (state.refreshing && state.list.length === 0) {return 'loading'}
    if (state.error && state.list.length === 0) {return 'error'}
    return 'ready'
  }, [state.refreshing, state.error, state.list.length])

  // auto 首刷
  useEffect(() => {
    if (!auto) {return}
    if (autoParams === undefined) {return}
    refresh(autoParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...state,
    status, // 'loading' | 'error' | 'ready'
    refresh,
    loadMore,
    reload,
    reset,
    setList,
    setParams: (p: P) => (paramsRef.current = p),
    getParams: () => paramsRef.current,
  }
}
