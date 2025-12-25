import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

import { useMemo } from 'react'

import BaseButton from './BaseButton'
import { useRipple } from './hooks/useRipple'
import ScaleOpacityButton from './ScaleAlphaButton'
import fx from './styles/ripple.module.less'
import { cx } from './utils/cx'

import type { RippleButtonProps } from './types'

/**
 * 按钮点击水波纹效果，对齐Android原生按钮水波纹效果
 * @param props
 * @constructor
 */
export default function RippleButton(props: RippleButtonProps) {
  const {
    rippleColor = 'rgba(255,255,255,.35)',
    disabled = false,
    loading = false,
    className,
    children,
    ...rest
  } = props

  const isDisabled = disabled || loading
  const env = Taro.getEnv()
  const isRN = env === Taro.ENV_TYPE.RN

  const hostId = useMemo(
    () => `uni-ripple-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    []
  )

  const { ripples, addRipple } = useRipple({ enabled: !isDisabled, hostId, duration: 520 })


  // RN 端降级
  if (isRN) {
    return (
      <ScaleOpacityButton disabled={disabled} loading={loading} className={className} {...rest}>
        {children}
      </ScaleOpacityButton>
    )
  }


  return (
    <BaseButton
      {...rest}
      disabled={disabled}
      loading={loading}
      // BaseButton 内部也会生成 id，但 ripple 需要我们自己的 id 来查 rect
      id={hostId as any}
      className={cx(fx.host, className)}
      onTouchStart={(e) => {
        addRipple(e)
        props.onTouchStart?.(e)
      }}
    >
      <View className={fx.rippleWrap} aria-hidden='true'>
        {ripples.map((r) => (
          <View
            key={r.key}
            className={fx.ripple}
            style={{
              left: `${r.left}px`,
              top: `${r.top}px`,
              width: `${r.size}px`,
              height: `${r.size}px`,
              backgroundColor: rippleColor,
            }}
          />
        ))}
      </View>

      <View className={fx.content}>{children}</View>
    </BaseButton>
  )
}
