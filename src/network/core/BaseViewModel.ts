import { CancelScope } from '@/network'

export class BaseViewModel {
  readonly cancelScope = new CancelScope()

  dispose() {
    this.cancelScope.cancelAll()
  }
}
