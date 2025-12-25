
export type CancelFn = () => void

/**
 * MVVM架构与页面绑定，取消请求
 */
export class CancelScope {
  private groups = new Map<string, Set<CancelFn>>()

  register(fn?: CancelFn, group = 'DEFAULT') {
    if (!fn) {return () => {}}
    let set = this.groups.get(group)
    if (!set) {
      set = new Set()
      this.groups.set(group, set)
    }
    set.add(fn)
    return () => set?.delete(fn)
  }

  cancelGroup(group: string) {
    const set = this.groups.get(group)
    if (!set) {return}
    for (const fn of Array.from(set)) {
      try { fn() } catch {}
    }
    set.clear()
  }

  cancelAll() {
    for (const group of Array.from(this.groups.keys())) {
      this.cancelGroup(group)
    }
  }
}
