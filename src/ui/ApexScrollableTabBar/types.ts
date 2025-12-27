import {CSSProperties, ReactNode} from "react";


export type ApexTabKey = string | number

export interface ApexTabItemConfig {
  key: ApexTabKey
  title: ReactNode

  /** 内容渲染，只在被虚拟窗口命中时才会调用（达到回收释放效果） */
  render: () => ReactNode

  /** tab item 样式 */
  className?: string
  activeClassName?: string
  tabClassName?: string
  tabActiveClassName?: string
  tabDisabledClassName?: string
  disabled?: boolean

  /** 内容 wrapper 样式 */
  contentStyle?: CSSProperties
  contentClassName?: string
}

export interface ApexScrollableTabBarProps {
  tabs: ApexTabItemConfig[]

  /** 非受控初始值 */
  defaultCurrent?: number
  /** 受控值 */
  current?: number

  contentHeightPx?: number
  stuck ?: boolean

  /** 预加载：左右各 preload 个（窗口大小约等于 2*preload+1） */
  preload?: number

  /** 是否允许滑动切换 */
  swipeable?: boolean
  /** swiper 动画时长（ms） */
  duration?: number

  /** 容器样式 */
  className?: string
  style?: CSSProperties

  /** tabbar 样式 */
  tabBarClassName?: string
  tabBarInnerClassName?: string
  tabBarStyle?: CSSProperties

  /** 外部自定义 tab 渲染 */
  renderTab?: (tab: ApexTabItemConfig, opts: { index: number; active: boolean }) => ReactNode

  /** 切换回调 */
  onChange?: (index: number, tab: ApexTabItemConfig) => void
}
