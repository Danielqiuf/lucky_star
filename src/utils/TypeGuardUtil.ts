export type AnyRecord = Record<string, any>

/**
 * 通用类型断言工具
 */
export class TypeGuardUtil {
  private static toString = Object.prototype.toString

  /** 返回类似: 'String' | 'Number' | 'Array' | 'Object' ... */
  static tagOf(val: unknown): string {
    return TypeGuardUtil.toString.call(val).slice(8, -1)
  }

  static typeOf(val: unknown):
    | 'null'
    | 'undefined'
    | 'string'
    | 'number'
    | 'boolean'
    | 'symbol'
    | 'bigint'
    | 'function'
    | 'object' {
    if (val === null) {return 'null'}
    return typeof val
  }

  static isNil(val: unknown): val is null | undefined {
    return val === null || val === undefined
  }

  static isString(val: unknown): val is string {
    return typeof val === 'string' || TypeGuardUtil.tagOf(val) === 'String'
  }

  static isNumber(val: unknown): val is number {
    return typeof val === 'number' || TypeGuardUtil.tagOf(val) === 'Number'
  }

  static isFiniteNumber(val: unknown): val is number {
    return TypeGuardUtil.isNumber(val) && Number.isFinite(val as number)
  }

  static isBoolean(val: unknown): val is boolean {
    return typeof val === 'boolean' || TypeGuardUtil.tagOf(val) === 'Boolean'
  }

  static isFunction<T extends Function = Function>(val: unknown): val is T {
    return typeof val === 'function'
  }

  static isAsyncFunction(val: unknown): val is (...args: any[]) => Promise<any> {
    return TypeGuardUtil.tagOf(val) === 'AsyncFunction'
  }

  static isArray<T = unknown>(val: unknown): val is T[] {
    return Array.isArray(val)
  }

  static isDate(val: unknown): val is Date {
    return TypeGuardUtil.tagOf(val) === 'Date'
  }

  static isRegExp(val: unknown): val is RegExp {
    return TypeGuardUtil.tagOf(val) === 'RegExp'
  }

  static isMap<K = any, V = any>(val: unknown): val is Map<K, V> {
    return TypeGuardUtil.tagOf(val) === 'Map'
  }

  static isSet<T = any>(val: unknown): val is Set<T> {
    return TypeGuardUtil.tagOf(val) === 'Set'
  }

  static isPromise<T = any>(val: unknown): val is Promise<T> {
    return !!val && (typeof val === 'object' || typeof val === 'function') && TypeGuardUtil.isFunction((val as any).then)
  }

  static isObject(val: unknown): val is object {
    return TypeGuardUtil.typeOf(val) === 'object'
  }

  static isRecord(val: unknown): val is AnyRecord {
    return TypeGuardUtil.tagOf(val) === 'Object'
  }

  static isPlainObject(val: unknown): val is AnyRecord {
    if (!TypeGuardUtil.isRecord(val)) {return false}
    const proto = Object.getPrototypeOf(val)
    return proto === Object.prototype || proto === null
  }

  /** 空判定：null/undefined/''/[]/{} */
  static isEmpty(val: unknown): boolean {
    if (TypeGuardUtil.isNil(val)) {return true}
    if (TypeGuardUtil.isString(val)) {return val.trim().length === 0}
    if (TypeGuardUtil.isArray(val)) {return val.length === 0}
    if (TypeGuardUtil.isPlainObject(val)) {return Object.keys(val).length === 0}
    return false
  }

  /** 断言：不满足直接抛错（用于运行时兜底） */
  static assert(condition: unknown, message = 'Assertion failed'): asserts condition {
    if (!condition) {throw new Error(message)}
  }

  /** 断言某值非空 */
  static assertNonNil<T>(val: T, message = 'Value is null or undefined'): asserts val is NonNullable<T> {
    if (val === null || val === undefined) {throw new Error(message)}
  }
}
