import { ChatsPage } from '../pages'
import { Profile } from '../pages/chats'
import { CreateChat } from '../pages/chats/components/create-chat'
import { UserList } from '../pages/chats/components/user-list'
import { AuthService, ChatsService, RealTimeMessageService } from '../services'
import {
  ChatsResponse,
  InstantMessage,
  OldInstantMessage,
  UserResponse,
} from '../type/api'
import { cloneDeep, connect, Controller, disconnect } from '../utils'
import { ProfileController } from './Profile.controller'
import { UserListController } from './UserList.controller'

export class ChatsPageController extends Controller<
  InstanceType<typeof ChatsPage>
> {
  private _createChatComp: InstanceType<typeof CreateChat>

  private _chatsService = new ChatsService()

  private _authService = new AuthService()

  private _profileController: ProfileController

  private _userListController: UserListController

  private _realTimeMessageService: RealTimeMessageService | null = null

  constructor(options: ConstructorParameters<typeof ChatsPage>[0]) {
    super(new ChatsPage(options))

    const profile = this.baseComponent.getChildrenByName(
      'Profile'
    ) as InstanceType<typeof Profile>
    this._createChatComp = this.baseComponent.getChildrenByName(
      'CreateChat'
    ) as InstanceType<typeof CreateChat>
    const userList = this.baseComponent.getChildrenByName(
      'UserList'
    ) as InstanceType<typeof UserList>

    this._profileController = new ProfileController(profile)

    connect(
      this.baseComponent,
      ChatsPage.emits.showSettings,
      this._profileController,
      ProfileController.listening.userInfo
    )
    connect(
      this.baseComponent,
      ChatsPage.emits.selectChat,
      this._chatsService,
      ChatsService.listening.token
    )

    this._userListController = new UserListController(userList)
    connect(
      this.baseComponent,
      ChatsPage.emits.showUserList,
      this._userListController,
      UserListController.listening.userList
    )
    connect(
      this._userListController,
      UserListController.emits.removeChat,
      this._chatsService,
      ChatsService.listening.removeChat
    )
    connect(
      this._userListController,
      UserListController.emits.liveChat,
      this,
      this._chatRemoved
    )

    connect(
      this._createChatComp,
      CreateChat.emits.cancel,
      this,
      this._chatCreateToggle
    )
    connect(
      this._createChatComp,
      CreateChat.emits.create,
      this,
      this._createChat
    )
    connect(
      this.baseComponent,
      ChatsPage.emits.createChat,
      this,
      this._chatCreateToggle
    )

    connect(
      this._chatsService,
      ChatsService.emits.createChat,
      this,
      this._chatCreated
    )
    connect(
      this._chatsService,
      ChatsService.emits.updateChats,
      this,
      this._updateChats
    )
    connect(
      this._chatsService,
      ChatsService.emits.removeChat,
      this,
      this._chatRemoved
    )
    connect(
      this._chatsService,
      ChatsService.emits.removeChat,
      this._userListController,
      UserListController.listening.close
    )

    this._chatsService.emit(ChatsService.listening.updateChats)
    this._authService.emit(AuthService.listening.userInfo)

    connect(
      this._authService,
      AuthService.emits.userInfo,
      (user: UserResponse) => {
        connect(
          this._chatsService,
          ChatsService.emits.token,
          this,
          (chatId: number, token: string) => {
            this._selectChat(user.id, chatId, token)
          }
        )
      }
    )
  }

  private _selectChat(userId: number, chatId: number, token: string) {
    const currentChat = this.baseComponent.data.chats.find(
      ({ id }) => id === chatId
    )

    window.history.replaceState(
      null,
      '',
      currentChat ? `#${currentChat.id}` : ''
    )

    const sendMessage = (message: string) => {
      if (!this._realTimeMessageService) {
        throw new Error('Нет подключения для отправки сообщения')
      }
      this._realTimeMessageService.emit(
        RealTimeMessageService.listening.sendMessage,
        message
      )
    }

    if (this._realTimeMessageService !== null) {
      disconnect(this.baseComponent, ChatsPage.emits.sendMessage, sendMessage)
      this._realTimeMessageService = null
    }
    this._realTimeMessageService = new RealTimeMessageService(
      userId,
      chatId,
      token
    )
    connect(
      this._realTimeMessageService,
      RealTimeMessageService.emits.open,
      () => {
        if (!this._realTimeMessageService) {
          throw new Error('Нет подключения...')
        }
        connect(this.baseComponent, ChatsPage.emits.sendMessage, sendMessage)
        connect(
          this._realTimeMessageService,
          RealTimeMessageService.emits.message,
          (newMessage: InstantMessage) => {
            const messages = cloneDeep(this.baseComponent.data.messages)

            messages.push({
              date: new Date(newMessage.time),
              isSend: userId === Number(newMessage.user_id),
              text: newMessage.content,
              type: 'income',
            })

            this.baseComponent.setProps({ messages })
          }
        )
        connect(
          this._realTimeMessageService,
          RealTimeMessageService.emits.oldMessages,
          (oldMessages: OldInstantMessage[]) => {
            const forCurrentChatMessages = oldMessages
              .filter((message) => message.chat_id === chatId)
              .map((message) => ({
                date: new Date(message.time),
                isSend: userId === Number(message.user_id),
                text: message.content,
                type: 'income' as 'income' | 'send',
              }))
              .reverse()

            const messages = cloneDeep(this.baseComponent.data.messages)

            messages.push(...forCurrentChatMessages)

            this.baseComponent.setProps({ messages })
          }
        )

        this._realTimeMessageService.emit(
          RealTimeMessageService.listening.unreadMessages,
          0
        )
        this.baseComponent.setProps({ currentChat })
      }
    )
  }

  private _updateChats(newChats: ChatsResponse[]) {
    const chats = cloneDeep(this.baseComponent.data.chats)
    chats.push(...newChats)
    const chatId = parseInt(window.location.hash.substring(1), 10)
    const currentChat = chats.find((chat) => chat.id === chatId)
    this.baseComponent.setProps({ chats })
    if (!currentChat) {
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search
      )
    } else {
      this._chatsService.emit(ChatsService.listening.token, chatId)
    }
  }

  private _chatCreateToggle() {
    const { isHide } = this._createChatComp.data
    this._createChatComp.setProps({ isHide: !isHide })
  }

  private _chatCreated() {
    this._chatsService.emit(ChatsService.listening.updateChats, {
      offset: 0,
      limit: 1,
    })
    this._createChatComp.setProps({ isHide: true, chatName: '' })
  }

  private _chatRemoved(chatId: number) {
    const chats = cloneDeep(this.baseComponent.data.chats)

    const removeIdx = chats.findIndex(({ id }) => id === chatId)
    if (removeIdx < 0) {
      throw new Error('Chat not found')
    }
    chats.splice(removeIdx, 1)
    this.baseComponent.setProps({ chats })
  }

  private _createChat() {
    const { chatName } = this._createChatComp.data
    this._chatsService.emit(ChatsService.listening.createChat, chatName)
  }
}
