import Taro from '@tarojs/taro'

/**
 * 通用页面导航工具
 */
export class NavUtil {
  static to(url: string, params?: Record<string, any>) {
    const finalUrl = NavUtil.withQuery(url, params)
    return Taro.navigateTo({ url: finalUrl })
  }

  static redirect(url: string, params?: Record<string, any>) {
    const finalUrl = NavUtil.withQuery(url, params)
    return Taro.redirectTo({ url: finalUrl })
  }

  static relaunch(url: string, params?: Record<string, any>) {
    const finalUrl = NavUtil.withQuery(url, params)
    return Taro.reLaunch({ url: finalUrl })
  }

  static tab(url: string) {
    return Taro.switchTab({ url })
  }

  static back(delta = 1) {
    return Taro.navigateBack({ delta })
  }

  static withQuery(url: string, params?: Record<string, any>) {
    if (!params || Object.keys(params).length === 0) {return url}
    const [path, hash] = url.split('#')
    const join = path.includes('?') ? '&' : '?'
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
    return `${path}${join}${query}${hash ? `#${hash}` : ''}`
  }
}
