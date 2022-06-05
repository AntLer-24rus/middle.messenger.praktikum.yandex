import { getType } from './getType'
import { queryStringify } from './queryStringify'

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type HTTPTransportOptions = {
  method: METHODS
  param?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

type HTTPTransportOptionsWithoutMethod = Omit<HTTPTransportOptions, 'method'>

type HTTPTransportResponse<ResponseType = unknown> = {
  headers: Record<string, string>
  status: number
  statusText: string
  data: ResponseType
}

interface HTTPTransportInterface {
  get<ResponseType = unknown>(
    pathname?: string,
    options?: HTTPTransportOptionsWithoutMethod
  ): Promise<HTTPTransportResponse<ResponseType>>
  put<ResponseType = unknown>(
    pathname?: string,
    options?: HTTPTransportOptionsWithoutMethod
  ): Promise<HTTPTransportResponse<ResponseType>>
  patch<ResponseType = unknown>(
    pathname?: string,
    options?: HTTPTransportOptionsWithoutMethod
  ): Promise<HTTPTransportResponse<ResponseType>>
  post<ResponseType = unknown>(
    pathname?: string,
    options?: HTTPTransportOptionsWithoutMethod
  ): Promise<HTTPTransportResponse<ResponseType>>
  delete<ResponseType = unknown>(
    pathname?: string,
    options?: HTTPTransportOptionsWithoutMethod
  ): Promise<HTTPTransportResponse<ResponseType>>
}

export class HTTPTransport implements HTTPTransportInterface {
  private _baseUrl: string

  constructor(baseUrl: string = window.location.origin) {
    this._baseUrl = baseUrl.replace(/\/$/, '')
  }

  get<ResponseType = unknown>(
    pathname = '',
    options = {} as HTTPTransportOptionsWithoutMethod
  ) {
    if (pathname && !/^\/[^?]*$/gm.test(pathname)) {
      throw new Error('Неправильно использован параметр pathname')
    }
    return this._request<ResponseType>(
      options.param ? `${pathname}?${queryStringify(options.param)}` : pathname,
      {
        ...options,
        method: METHODS.GET,
      }
    )
  }

  put<ResponseType = unknown>(pathname = '', options = {}) {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this._request<ResponseType>(pathname, {
      ...options,
      method: METHODS.PUT,
    })
  }

  patch<ResponseType = unknown>(pathname = '', options = {}) {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')

    return this._request<ResponseType>(pathname, {
      ...options,
      method: METHODS.PATCH,
    })
  }

  post<ResponseType = unknown>(pathname = '', options = {}) {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this._request<ResponseType>(pathname, {
      ...options,
      method: METHODS.POST,
    })
  }

  delete<ResponseType>(pathname = '', options = {}) {
    if (pathname && !/^\/[^?]*$/gm.test(pathname))
      throw new Error('Неправильно использован параметр pathname')
    return this._request<ResponseType>(pathname, {
      ...options,
      method: METHODS.DELETE,
    })
  }

  private _request<ResponseType>(
    url: string,
    options: HTTPTransportOptions = { method: METHODS.GET }
  ) {
    const { method, param } = options

    return new Promise<HTTPTransportResponse<ResponseType>>(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, this._baseUrl + url)

        xhr.withCredentials = true

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
        } else if (getType(param) === 'formdata') {
          xhr.send(param)
        } else if (getType(param) === 'object') {
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.send(JSON.stringify(param))
        }
      }
    )
  }
}
