import{ CommonButtonProps } from '@/ui'

import BaseButton from './BaseButton'
import { usePressed } from './hooks/usePressed'
import fx from './styles/scale_alpha.module.less'
import { cx } from './utils/cx'


/**
 * 按钮点击缩放+透明度效果
 * @param props
 * @constructor
 */
export default function ScaleOpacityButton(props: CommonButtonProps) {
  const { disabled = false, loading = false, alpha, scale, className, children, ...rest } = props
  const isDisabled = disabled || loading
  const { pressed, onTouchStart, onTouchEnd, onTouchCancel } = usePressed(isDisabled)

  const style: any = {}
  if (alpha !== undefined) {style['--alpha'] = String(alpha)}
  if (scale !== undefined) {style['--scale'] = String(scale)}

  return (
    <BaseButton
      disabled={disabled}
      loading={loading}
      style={style}
      className={cx(fx.fb, pressed && fx.pressed, className )}
      onTouchStart={(e) => { onTouchStart(); props.onTouchStart?.(e) }}
      onTouchEnd={(e) => { onTouchEnd(); props.onTouchEnd?.(e) }}
      onTouchCancel={(e) => { onTouchCancel(); props.onTouchCancel?.(e) }}
      {...rest}
    >
      {children}
    </BaseButton>
  )
}
