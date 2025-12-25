import { Endpoint } from './endpoint'

import type { ApiClient } from './ApiClient'
import type { RequestMeta } from './types'

export class RestClient {
  constructor(private api: ApiClient) {}

  getData<T>(version: string, module: string, segments: Array<string | number>, opts?: { query?: any; meta?: RequestMeta }) {
    return this.api.requestData<T>({
      method: 'GET',
      url: Endpoint.restful(version, module, ...segments),
      query: opts?.query,
      meta: opts?.meta,
    })
  }

  postData<T>(version: string, module: string, segments: Array<string | number>, body?: any, meta?: RequestMeta) {
    return this.api.requestData<T>({
      method: 'POST',
      url: Endpoint.restful(version, module, ...segments),
      body,
      meta,
    })
  }

  putData<T>(version: string, module: string, segments: Array<string | number>, body?: any, meta?: RequestMeta) {
    return this.api.requestData<T>({
      method: 'PUT',
      url: Endpoint.restful(version, module, ...segments),
      body,
      meta,
    })
  }

  patchData<T>(version: string, module: string, segments: Array<string | number>, body?: any, meta?: RequestMeta) {
    return this.api.requestData<T>({
      method: 'PATCH',
      url: Endpoint.restful(version, module, ...segments),
      body,
      meta,
    })
  }

  deleteData<T>(version: string, module: string, segments: Array<string | number>, opts?: { query?: any; meta?: RequestMeta }) {
    return this.api.requestData<T>({
      method: 'DELETE',
      url: Endpoint.restful(version, module, ...segments),
      query: opts?.query,
      meta: opts?.meta,
    })
  }

  /** form-urlencoded（非文件） meta.bodyType='form' */
  postForm<T>(version: string, module: string, segments: Array<string | number>, form: Record<string, any>, meta?: RequestMeta) {
    return this.api.requestData<T>({
      method: 'POST',
      url: Endpoint.restful(version, module, ...segments),
      body: form,
      meta: { bodyType: 'form', ...meta },
    })
  }

  /** multipart 文件上传走 uploadFile */
  uploadData<T>(
    version: string,
    module: string,
    segments: Array<string | number>,
    upload: { filePath: string; name: string; fileName?: string; formData?: Record<string, any> },
    meta?: RequestMeta
  ) {
    return this.api.requestData<T>({
      method: 'POST',
      url: Endpoint.restful(version, module, ...segments),
      upload,
      meta,
    })
  }
}
