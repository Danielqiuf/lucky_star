import { Button } from '@tarojs/components'

import { useMemo } from 'react'

import { CommonButtonProps } from '@/ui'

import styles from './styles/base.module.less'
import { cx } from './utils/cx'


export default function BaseButton(props: CommonButtonProps) {
  const {
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
