/**
 * 常用函数工具
 * (debounce / throttle / once / sleep / retry）
 * debounce 防抖
 * throttle 节流
 */
export class FnUtil {
  static debounce<T extends (...args: any[]) => any>(fn: T, wait = 300) {
    let timer: any = null
    return (...args: Parameters<T>) => {
      if (timer) {clearTimeout(timer)}
      timer = setTimeout(() => fn(...args), wait)
    }
  }

  static throttle<T extends (...args: any[]) => any>(fn: T, wait = 300) {
    let last = 0
    let timer: any = null
    return (...args: Parameters<T>) => {
      const now = Date.now()
      const remaining = wait - (now - last)
      if (remaining <= 0) {
        if (timer) {clearTimeout(timer)}
        timer = null
        last = now
        fn(...args)
      } else if (!timer) {
        timer = setTimeout(() => {
          timer = null
          last = Date.now()
          fn(...args)
        }, remaining)
      }
    }
  }

  static once<T extends (...args: any[]) => any>(fn: T) {
    let called = false
    let result: ReturnType<T>
    return (...args: Parameters<T>) => {
      if (called) {return result}
      called = true
      result = fn(...args)
      return result
    }
  }

  static sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
  }

  /** 简单重试, 用于网络抖动 */
  static async retry<T>(
    task: () => Promise<T>,
    opts: { times?: number; delayMs?: number; shouldRetry?: (err: any) => boolean } = {}
  ): Promise<T> {
    const times = opts.times ?? 2
    const delayMs = opts.delayMs ?? 300
    for (let i = 0; i <= times; i++) {
      try {
        return await task()
      } catch (err) {
        const ok = opts.shouldRetry ? opts.shouldRetry(err) : true
        if (!ok || i === times) {throw err}
        await FnUtil.sleep(delayMs)
      }
    }
    // 理论不会到这里
    throw new Error('retry failed')
  }
}
