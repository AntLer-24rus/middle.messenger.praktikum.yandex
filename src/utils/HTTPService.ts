import { HTTPTransport } from './HTTPTransport'
import { Service } from './Service'

export abstract class HTTPService extends Service {
  protected transport: HTTPTransport

  constructor(baseUrl: string) {
    super()
    this.transport = new HTTPTransport(baseUrl)
  }
}
