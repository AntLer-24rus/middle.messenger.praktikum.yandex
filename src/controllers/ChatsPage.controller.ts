import { ChatsPage } from '../pages'
import { Profile } from '../pages/chats'
import { CreateChat } from '../pages/chats/components/create-chat'
import { UserList } from '../pages/chats/components/user-list'
import { ChatsService } from '../services'
import { ChatsResponse } from '../type/api'
import { cloneDeep, connect, Controller } from '../utils'
import { ProfileController } from './Profile.controller'
import { UserListController } from './UserList.controller'

export class ChatsPageController extends Controller<
  InstanceType<typeof ChatsPage>
> {
  private _createChatComp: InstanceType<typeof CreateChat>

  private _chatsService = new ChatsService()

  private _profileController: ProfileController

  private _userListController: UserListController

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
  }

  private _updateChats(newChats: ChatsResponse[]) {
    const chats = cloneDeep(this.baseComponent.data.chats)
    chats.push(...newChats)
    this.baseComponent.setProps({ chats })
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
