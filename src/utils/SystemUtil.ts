import Taro from '@tarojs/taro'

/**
 * 通用系统工具
 */
export class SystemUtil {
  private static cached: Taro.getSystemInfoSync.Result | null = null

  static info() {
    if (!SystemUtil.cached) {SystemUtil.cached = Taro.getSystemInfoSync()}
    return SystemUtil.cached
  }

  static refresh() {
    SystemUtil.cached = Taro.getSystemInfoSync()
    return SystemUtil.cached
  }

  static isIOS() {
    return /ios/i.test(SystemUtil.info().system || '')
  }

  static isAndroid() {
    return /android/i.test(SystemUtil.info().system || '')
  }

  static windowWidth() {
    return SystemUtil.info().windowWidth || 375
  }

  /** rpx -> px */
  static rpx2px(rpx: number) {
    return (SystemUtil.windowWidth() / 750) * rpx
  }

  /** px -> rpx */
  static px2rpx(px: number) {
    return (750 / SystemUtil.windowWidth()) * px
  }
}
