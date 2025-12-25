export class Endpoint {
  // 普通三段pathinfo： /v1/xxx/xxx
  static build(version: string, module: string, action: string) {
    const v = version.startsWith('v') ? version : `v${version}`
    return `/${v}/${module}/${action}`
  }

  // RESTFul API: /v1/xxx/xxx/123/xx
  static restful(version: string, module: string, ...segments: Array<string | number>) {
    const v = version.startsWith('v') ? version : `v${version}`
    const safe = segments.map((s) => encodeURIComponent(String(s)))
    return `/${v}/${module}/${safe.join('/')}`
  }
  // 模板传参：/v1/user/users/:id
  static fill(template: string, params: Record<string, string | number>) {
    return template.replace(/:([A-Za-z0-9_]+)/g, (_, k) => encodeURIComponent(String(params[k])))
  }
}
