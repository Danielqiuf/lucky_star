import type { ButtonProps } from '@tarojs/components'
import type * as React from 'react'

export type BtnType = 'default' | 'primary' | 'danger'
export type BtnSize = 'sm' | 'md' | 'lg'

/**
 * BaseButton 通用 props
 * 继承 Taro ButtonProps
 * 由组件接管：className/style/onClick/disabled/loading
 */
export type CommonButtonProps = Omit<
  ButtonProps,
  'className' | 'style' | 'onClick' | 'disabled' | 'loading'
> & {
  /** 视觉类型 */
  type?: BtnType
  /** 尺寸 */
  size?: BtnSize
  /** 是否占满父容器宽度 */
  block?: boolean

  /** 禁用（会与 loading 合并为不可点击） */
  disabled?: boolean
  /** loading 状态（会与 disabled 合并为不可点击） */
  loading?: boolean

  /** 额外类名 */
  className?: string
  /** 行内样式 */
  style?: React.CSSProperties

  /** 点击事件（disabled/loading 时不会触发） */
  onClick?: (e: any) => void

  /** 内容 */
  children?: React.ReactNode
}

export type RippleType = 'light' | 'dark';

export type RippleButtonProps = CommonButtonProps & {
  /** 水波纹颜色 */
  rippleColor?: string
  /** 水波纹类型, (light , dark), light下深色水波纹, dark下浅色水波纹 */
  rippleType?:  RippleType
}

export {}
