import {
  BadRequestError,
  ChatDeleteResponse,
  ChatsResponse,
  ChatUserResponse,
} from '../type/api'
import { connect, HTTPService } from '../utils'

export class ChatsService extends HTTPService {
  static emits = {
    updateChats: 'chats:emits',
    createChat: 'createChat:emits',
    removeChat: 'removeChat:emits',
    addUsers: 'addUsers:emits',
    deleteUsers: 'deleteUsers:emits',
    userList: 'userList:emits',
  }

  static listening = {
    updateChats: 'chats:listening',
    createChat: 'createChat:listening',
    removeChat: 'removeChat:listening',
    addUsers: 'addUsers:listening',
    deleteUsers: 'deleteUsers:listening',
    userList: 'userList:listening',
  }

  constructor() {
    super('https://ya-praktikum.tech/api/v2/chats/')

    connect(this, ChatsService.listening.updateChats, this, this.getChats)
    connect(this, ChatsService.listening.createChat, this, this.createChat)
    connect(this, ChatsService.listening.addUsers, this, this.addUsersToChat)
    connect(
      this,
      ChatsService.listening.deleteUsers,
      this,
      this.deleteUsersFromChat
    )
    connect(this, ChatsService.listening.userList, this, this.getUserList)
    connect(this, ChatsService.listening.removeChat, this, this.removeChat)
  }

  getChats(param?: { offset: number; limit: number; title?: string }): void {
    this.transport
      .get<ChatsResponse | undefined>('/', { param })
      .then(({ status, data, statusText }) => {
        if (!data) {
          throw new Error(`${status} - ${statusText}`)
        }
        this.emit(ChatsService.emits.updateChats, data)
      })
  }

  createChat(title: string) {
    this.transport
      .post<undefined | BadRequestError>('/', { param: { title } })
      .then(({ status, data, statusText }) => {
        if (data) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(ChatsService.emits.createChat)
      })
  }

  removeChat(chatId: number) {
    this.transport
      .delete<ChatDeleteResponse | undefined>('/', { param: { chatId } })
      .then(({ status, data, statusText }) => {
        if (!data) {
          throw new Error(`${status} - ${statusText}`)
        }
        this.emit(ChatsService.emits.removeChat, data.result.id)
      })
  }

  getUserList(
    id: number,
    param?: { offset: number; limit: number; name: string; email: string }
  ) {
    this.transport
      .get<ChatUserResponse | undefined>(`/${id}/users`, { param })
      .then(({ status, data, statusText }) => {
        if (!data) {
          throw new Error(`${status} - ${statusText}`)
        }
        this.emit(ChatsService.emits.userList, id, data)
      })
  }

  addUsersToChat(users: number[], chatId: number) {
    this.transport
      .put<undefined | BadRequestError>('/users', { param: { users, chatId } })
      .then(({ status, data, statusText }) => {
        if (data) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(ChatsService.emits.addUsers, users)
      })
  }

  deleteUsersFromChat(users: number[], chatId: number) {
    this.transport
      .delete<undefined | BadRequestError>('/users', {
        param: { users, chatId },
      })
      .then(({ status, data, statusText }) => {
        if (status >= 400) {
          throw new Error(`${status} - ${statusText} (${data?.reason})`)
        }
        this.emit(ChatsService.emits.deleteUsers, users)
      })
  }
}
