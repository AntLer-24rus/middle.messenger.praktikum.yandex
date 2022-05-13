enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type HTTPTransportOptions = {
  method: METHODS
  param?: any
}

type HTTPTransportOptionsWithoutMethod = Omit<HTTPTransportOptions, 'method'>

type HTTPTransportResponse = {
  headers: Record<string, string>
  status: number
  statusText: string
  data: any
}

type HTTPTransportMethodSignature = (
  pathname?: string,
  options?: HTTPTransportOptionsWithoutMethod
) => Promise<HTTPTransportResponse>

export class HTTPTransport {
  constructor(private _baseUrl: string = window.location.origin) {}
  get: HTTPTransportMethodSignature = (pathname = '', options = {}) => {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this.request(pathname, {
      ...options,
      method: METHODS.GET,
    })
  }
  put: HTTPTransportMethodSignature = (pathname = '', options = {}) => {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this.request(pathname, { ...options, method: METHODS.PUT })
  }
  patch: HTTPTransportMethodSignature = (pathname = '', options = {}) => {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this.request(pathname, { ...options, method: METHODS.PATCH })
  }
  post: HTTPTransportMethodSignature = (pathname = '', options = {}) => {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this.request(pathname, { ...options, method: METHODS.POST })
  }
  delete: HTTPTransportMethodSignature = (pathname = '', options = {}) => {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this.request(pathname, { ...options, method: METHODS.DELETE })
  }

  request(
    url: string,
    options: HTTPTransportOptions = { method: METHODS.GET }
  ) {
    const { method, param } = options

    return new Promise<HTTPTransportResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(method, new URL(url, this._baseUrl))

      xhr.addEventListener('abort', reject)
      xhr.addEventListener('error', reject)
      xhr.addEventListener('timeout', reject)

      xhr.addEventListener('load', () => {
        const headers = Object.fromEntries(
          xhr
            .getAllResponseHeaders()
            .trim()
            .split('\n')
            .map((i) => {
              const tuple = i.trim().split(':')
              return [tuple[0].trim(), tuple[1].trim()]
            })
        )
        const contentType = headers['content-type']
        const responseBody = xhr.response
        let data
        if (contentType?.includes('application/json')) {
          data = JSON.parse(responseBody)
        } else {
          data = responseBody
        }
        resolve({
          data,
          headers,
          status: xhr.status,
          statusText: xhr.statusText,
        })
      })

      if (method === METHODS.GET || !param) {
        xhr.send()
      } else {
        xhr.send(param)
      }
    })
  }
}
