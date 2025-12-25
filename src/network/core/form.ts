/**
 * Form 编码工具：x-www-form-urlencoded
 * @param data
 */
export function toFormUrlEncoded(data: Record<string, any>) {
  return Object.entries(data ?? {})
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}
