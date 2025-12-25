const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

class Scheduler {
  private queue = Promise.resolve()
  private lastDoneAt = 0

  schedule<T>(task: () => Promise<T>, gapMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue = this.queue.then(async () => {
        const now = Date.now()
        const wait = Math.max(0, gapMs - (now - this.lastDoneAt))
        if (wait > 0) {await sleep(wait)}

        try {
          const res = await task()
          resolve(res)
        } catch (e) {
          reject(e)
        } finally {
          this.lastDoneAt = Date.now()
        }
      })
    })
  }
}

export class ThrottleManager {
  private map = new Map<string, Scheduler>()

  private getScheduler(key: string) {
    let s = this.map.get(key)
    if (!s) {
      s = new Scheduler()
      this.map.set(key, s)
    }
    return s
  }

  schedule<T>(key: string, gapMs: number, task: () => Promise<T>): Promise<T> {
    return this.getScheduler(key).schedule(task, gapMs)
  }
}
