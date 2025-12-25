import type { RequestContext, ResponseContext } from './types'

export type Next = () => Promise<ResponseContext<any>>
export type Middleware = (ctx: RequestContext, next: Next) => Promise<ResponseContext<any>>

export function compose(middlewares: Middleware[], terminal: Next) {
  return function run(ctx: RequestContext) {
    let index = -1
    const dispatch = (i: number): Promise<ResponseContext<any>> => {
      if (i <= index) {return Promise.reject(new Error('next() called multiple times'))}
      index = i
      const fn = i === middlewares.length ? terminal : middlewares[i]
      if (!fn) {return Promise.resolve(undefined as any)}
      return Promise.resolve(fn(ctx, () => dispatch(i + 1)))
    }
    return dispatch(0)
  }
}
