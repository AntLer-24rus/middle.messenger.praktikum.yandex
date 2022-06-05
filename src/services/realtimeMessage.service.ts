import { connect, WSService } from '../utils'

export class RealTimeMessageService extends WSService {
  static emits = {
    open: 'RealTimeMessageService:open:emits',
    close: 'RealTimeMessageService:close:emits',
    error: 'RealTimeMessageService:error:emits',
    message: 'RealTimeMessageService:message:emits',
  }

  static listening = {
    sendMessage: 'RealTimeMessageService:sendMessage:emits',
    unreadMessages: 'RealTimeMessageService:unreadMessages:emits',
  }

  constructor(userId: number, chatId: number, token: string) {
    super(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`)

    connect(
      this,
      RealTimeMessageService.listening.sendMessage,
      this,
      this._sendMessage
    )
    connect(
      this,
      RealTimeMessageService.listening.unreadMessages,
      this,
      this._getUnreadMessages
    )
  }

  protected open(): void {
    console.log('RealTimeMessageService -> Open', this)
    this.socket.send(
      JSON.stringify({
        content: '0',
        type: 'get old',
      })
    )
    this.emit(RealTimeMessageService.emits.open)
  }

  protected close(code: number, reason: string): void {
    console.log('RealTimeMessageService -> Close', code, reason)
    this.emit(RealTimeMessageService.emits.close, code, reason)
  }

  protected error(description): void {
    console.log('RealTimeMessageService -> Error', description)
    this.emit(RealTimeMessageService.emits.error)
  }

  protected message(data: any): void {
    if (Array.isArray(data)) {
      console.log('old messages :>> ', data)
    } else {
      const { type } = data
      if (type === 'message') {
        this.emit(RealTimeMessageService.emits.message, data)
      }
    }
  }

  private _getUnreadMessages(offset: number) {
    this.socket.send(
      JSON.stringify({
        content: String(offset),
        type: 'get old',
      })
    )
  }

  private _sendMessage(message: string) {
    this.socket.send(
      JSON.stringify({
        content: message,
        type: 'message',
      })
    )
  }
}
