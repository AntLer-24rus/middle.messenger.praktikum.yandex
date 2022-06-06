import { Service } from './Service'

export abstract class WSService extends Service {
  protected socket: WebSocket

  constructor(url: string) {
    super()
    this.socket = new WebSocket(url)
    this.socket.addEventListener('open', this.open.bind(this))
    this.socket.addEventListener('close', this._close.bind(this))
    this.socket.addEventListener('error', this._error.bind(this))
    this.socket.addEventListener('message', this._message.bind(this))
  }

  private _error(event: Event) {
    this.error({ code: -1, reason: 'Unknown reason' })
  }

  private _close(event: CloseEvent): void {
    if (event.wasClean) {
      this.close(event.code, event.reason)
    } else {
      this.error({ code: event.code, reason: event.reason })
    }
  }

  private _message(event: MessageEvent): void {
    this.message(JSON.parse(event.data))
  }

  protected abstract open(): void

  protected abstract close(code: number, reason: string): void

  protected abstract error(description?: { code: number; reason: string }): void

  protected abstract message(data: any): void
}
