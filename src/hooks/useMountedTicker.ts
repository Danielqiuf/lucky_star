import Taro from "@tarojs/taro";

import {useEffect, useRef} from "react";

/**
 * 页面挂载时在下一帧立即执行函数，解决动画问题
 * @param fn
 * @param delay
 */
export function useMountedTicker(fn: () => void, delay = 0) {
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) {
      fn();
      return;
    }

    mountedRef.current = true

    Taro.nextTick(() => {
      setTimeout(() => fn(), delay)
    })
  }, [fn, delay])
}
