import Taro from '@tarojs/taro'

type StoredValue<T> = {
  v: T
  e?: number // expireAt (ms)
}

/**
 * 通用本地缓存工具
 */
export class StorageUtil {
  static async set<T>(key: string, value: T, expireMs?: number) {
    const data: StoredValue<T> = {
      v: value,
      e: expireMs ? Date.now() + expireMs : undefined,
    }
    await Taro.setStorage({ key, data })
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const res = await Taro.getStorage({ key })
      const data = res.data as StoredValue<T> | T
      // 兼容历史直接存原始值
      if (data && typeof data === 'object' && 'v' in (data as any)) {
        const boxed = data as StoredValue<T>
        if (boxed.e && Date.now() > boxed.e) {
          await StorageUtil.remove(key)
          return null
        }
        return boxed.v
      }
      return (data as T) ?? null
    } catch {
      return null
    }
  }

  static async remove(key: string) {
    try {
      await Taro.removeStorage({ key })
    } catch {}
  }

  static async clear() {
    try {
      await Taro.clearStorage()
    } catch {}
  }
}
