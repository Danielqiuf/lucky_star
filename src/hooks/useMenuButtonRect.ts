import Taro from "@tarojs/taro";

import {useMemo} from "react";

/**
 * 获取小程序胶囊按钮区域布局信息
 */
export function useMenuButtonRect() {
  return useMemo(() => Taro.getMenuButtonBoundingClientRect(), [])
}
