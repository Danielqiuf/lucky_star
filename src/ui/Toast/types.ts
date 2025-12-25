export type ToastPlacement = 'top' | 'center' | 'bottom'

export type ToastShowOptions = {
  message: string
  duration?: number // ms，默认 2000；<=0 不自动关闭
  placement?: ToastPlacement
  bgColor?: string
  textColor?: string
}

type ToastCommand =
  | { type: 'show'; payload: ToastShowOptions }
  | { type: 'hide' }

export type Listener = (cmd: ToastCommand) => void

export type Phase = 'hidden' | 'enter' | 'leave'



