import BaseButton from './BaseButton'
import { usePressed } from './hooks/usePressed'
import fx from './styles/scale+alpha.module.less'
import { cx } from './utils/cx'

import type { CommonButtonProps } from './types'

/**
 * 按钮点击缩放+透明度效果
 * @param props
 * @constructor
 */
export default function ScaleOpacityButton(props: CommonButtonProps) {
  const { disabled = false, loading = false, className, children, ...rest } = props
  const isDisabled = disabled || loading
  const { pressed, onTouchStart, onTouchEnd, onTouchCancel } = usePressed(isDisabled)

  return (
    <BaseButton
      disabled={disabled}
      loading={loading}
      className={cx(fx.fb, pressed && fx.pressed, className)}
      onTouchStart={(e) => { onTouchStart(); props.onTouchStart?.(e) }}
      onTouchEnd={(e) => { onTouchEnd(); props.onTouchEnd?.(e) }}
      onTouchCancel={(e) => { onTouchCancel(); props.onTouchCancel?.(e) }}
      {...rest}
    >
      {children}
    </BaseButton>
  )
}
