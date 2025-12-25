/**
 * 持久化处理
 */
import Taro from '@tarojs/taro'

export const persistStorage = {
  async getItem(key: string) {
    try {
      const res = await Taro.getStorage({key});
      return typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    } catch {
      return null
    }
  },

  async setItem(key: string, value: string) {
    await Taro.setStorage({ key, data: value });
    return value;
  },

  async removeItem(key: string) {
    try{
      await Taro.removeStorage({key});
    } catch {}
  }
}
