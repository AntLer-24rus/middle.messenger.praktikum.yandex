import { HTTPService } from '../utils'

export const enum ResourceServiceEvents {
  requestResource = 'resource:request',
  receivedResource = 'resource:received',
}

export class ResourceService extends HTTPService {
  static listening = {
    updateResource: 'ResourceService:updateResource:listening',
  }

  static emits = {
    updateResource: 'ResourceService:updateResource:emits',
  }

  constructor() {
    super('https://ya-praktikum.tech/api/v2/resources')
    this.on(
      ResourceService.listening.updateResource,
      this.getResource.bind(this)
    )
  }

  getResource(path: string) {
    this.transport.get(`${path}`).then(({ status, statusText }) => {
      if (status >= 400) {
        throw new Error(`${status} - ${statusText}`)
      }
      this.emit(ResourceService.emits.updateResource)
    })
  }
}
