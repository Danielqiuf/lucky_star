import type { ToastShowOptions, Listener } from './types'

const listeners = new Set<Listener>()

let lastCmd: { type: 'show'; payload: ToastShowOptions } | { type: 'hide' } | null = null


function emit(cmd: any) {
  lastCmd = cmd
  listeners.forEach((fn) => fn(cmd))
}

export const toastFactory = {
  show(payload: ToastShowOptions) { emit({ type: 'show', payload }) },
  hide() { emit({ type: 'hide' }) },
  _subscribe(fn: Listener) {
    listeners.add(fn)
    if (lastCmd) {fn(lastCmd)}
    return () => listeners.delete(fn)
  },
}
