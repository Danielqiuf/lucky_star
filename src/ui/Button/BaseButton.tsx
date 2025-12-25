import { Button } from '@tarojs/components'

import { useMemo } from 'react'

import styles from './styles/base.module.less'
import { cx } from './utils/cx'

import type { CommonButtonProps } from './types'

export default function BaseButton(props: CommonButtonProps) {
  const {
    type = 'default',
    size = 'md',
    block = false,
    disabled = false,
    loading = false,
    className,
    style,
    onClick,
    children,
    ...rest
  } = props

  const isDisabled = disabled || loading

  // 保证每个实例有稳定 id（给 ripple 用）
  const id = useMemo(() => `uni-btn-${Date.now()}-${Math.random().toString(16).slice(2)}`, [])

  return (
    <Button
      id={id}
      className={cx(
        styles.btn,
        styles[`type-${type}`],
        styles[`size-${size}`],
        block && styles.block,
        className,
      )}
      style={style}
      disabled={isDisabled}
      loading={loading}
      hoverClass={!isDisabled ? styles.hover : ''}
      onClick={(e) => {
        if (isDisabled) {
          return
        }
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}
