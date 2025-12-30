import {ReactNode} from "react";

export type CenteredModalPayload = {
  confirmText?: string
  subText?: string;
  closeOnMask?: boolean
  centerWidget: ReactNode;
  /** 点确认按钮触发；默认会在执行后自动 hide */
  onConfirm?: () => void | Promise<void>
  onSubConfirm?: () => void | Promise<void>
}

export type CenteredModalListener = (state: CenteredModalPayload | null) => void
