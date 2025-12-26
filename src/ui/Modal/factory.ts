import type {CenteredModalPayload, CenteredModalListener} from "./types";

let current: CenteredModalPayload | null = null
const listeners = new Set<CenteredModalListener>()

function emit() {
  listeners.forEach((fn) => fn(current))
}

export const modalFactory = {
  show(payload: CenteredModalPayload) {
    current = {
      confirmText: '继续',
      closeOnMask: false,
      ...payload,
    }
    emit()
  },
  hide() {
    current = null
    emit()
  },
  subscribe(fn: CenteredModalListener) {
    listeners.add(fn)
    // 订阅立刻同步一次当前状态
    fn(current)
    return () => {
      listeners.delete(fn)
    }
  },
}
