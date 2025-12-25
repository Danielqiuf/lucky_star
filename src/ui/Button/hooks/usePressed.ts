import { useRef, useState } from 'react'

export function usePressed(disabled: boolean) {
  const pressing = useRef(false)
  const [pressed, setPressed] = useState(false)

  const onTouchStart = () => {
    if (disabled) {return}
    pressing.current = true
    setPressed(true)
  }

  const onTouchEnd = () => {
    if (!pressing.current) {return}
    pressing.current = false
    setPressed(false)
  }

  const onTouchCancel = onTouchEnd

  return { pressed, onTouchStart, onTouchEnd, onTouchCancel }
}
