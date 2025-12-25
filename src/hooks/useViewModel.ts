import { useDidHide, useUnload } from '@tarojs/taro'

import { useEffect, useMemo } from 'react'

import type { BaseViewModel } from '@/network'

type Options = {
  cancelOnHide?: boolean // 默认 true, 页面进入后台也取消
}

/**
 * MVVM模式页面管理
 * @example ```
 *  const vm = useViewModel(() => new UserPageVM(), { cancelOnHide: true })
 * ```
 * @param factory
 * @param opts
 */
export function useViewModel<T extends BaseViewModel>(
  factory: () => T,
  opts: Options = {}
) {
  const vm = useMemo(() => factory(), [])
  const cancelOnHide = opts.cancelOnHide ?? true

  // 页面卸载
  useUnload(() => {
    vm.dispose()
  })

  // 页面隐藏
  useDidHide(() => {
    if (cancelOnHide) {vm.dispose()}
  })

  // 页面卸载
  useEffect(() => {
    return () => vm.dispose()
  }, [vm])

  return vm
}
