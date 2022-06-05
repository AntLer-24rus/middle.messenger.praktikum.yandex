import { UserList } from '../pages/chats/components/user-list'
import { AuthService, ChatsService, UsersService } from '../services'
import { ChatUserResponse, UserResponse } from '../type/api'
import { cloneDeep, connect, Controller } from '../utils'

type UserListInstance = InstanceType<typeof UserList>

export class UserListController extends Controller<UserListInstance> {
  static listening = {
    ...super.listening,
    userList: 'UserListController:userList:listening',
    close: 'UserListController:close:listening',
  }

  static emits = {
    removeChat: 'UserListController:removeChat:emits',
    liveChat: 'UserListController:liveChat:emits',
  }

  private _chatsService: ChatsService = new ChatsService()

  private _usersService: UsersService = new UsersService()

  private _authService: AuthService = new AuthService()

  constructor(userListComponent: UserListInstance) {
    super(userListComponent)

    connect(
      this,
      UserListController.listening.userList,
      this._chatsService,
      ChatsService.listening.userList
    )
    connect(
      this,
      UserListController.listening.userList,
      this._authService,
      AuthService.listening.userInfo
    )
    connect(this, UserListController.listening.close, this, this._close)

    connect(
      this._authService,
      AuthService.emits.userInfo,
      this,
      this._updateCurrentUser
    )
    connect(this._usersService, UsersService.emits.findUser, this, this._search)
    connect(
      this._chatsService,
      ChatsService.emits.userList,
      this,
      this._updateUserList
    )
    connect(
      this._chatsService,
      ChatsService.emits.addUsers,
      this,
      this._addUsers
    )
    connect(
      this._chatsService,
      ChatsService.emits.deleteUsers,
      this,
      this._removeUsers
    )

    connect(this.baseComponent, UserList.emits.close, this, this._close)
    connect(
      this.baseComponent,
      UserList.emits.removeChat,
      this,
      UserListController.emits.removeChat
    )
    connect(
      this.baseComponent,
      UserList.emits.search,
      this._usersService,
      UsersService.listening.findUser
    )
    connect(
      this.baseComponent,
      UserList.emits.addUser,
      this._chatsService,
      ChatsService.listening.addUsers
    )
    connect(
      this.baseComponent,
      UserList.emits.removeUser,
      this._chatsService,
      ChatsService.listening.deleteUsers
    )
  }

  private _search(foundUsers: UserResponse[]) {
    const existingUsers = this.baseComponent.data.users
    const isChatIncludes = (user: UserResponse): boolean => {
      const userInChat = existingUsers.find((exUser) => user.id === exUser.id)
      return !!userInChat && userInChat.role !== 'external'
    }
    const users = foundUsers.map((user) => ({
      ...user,
      role: isChatIncludes(user) ? 'regular' : 'external',
    }))
    this.baseComponent.setProps({ users })
  }

  private _addUsers(newUsers: number[]) {
    const users = cloneDeep(this.baseComponent.data.users).map((user) => {
      if (newUsers.includes(user.id) && user.role !== 'admin') {
        return { ...user, role: 'regular' }
      }
      return user
    })
    this.baseComponent.setProps({ users })
  }

  private _removeUsers(removeUsers: number[]) {
    const users = cloneDeep(this.baseComponent.data.users)
    removeUsers.forEach((removeUserId) => {
      const removeIdx = users.findIndex((user) => removeUserId === user.id)
      if (removeIdx < 0) {
        throw new Error('User not found')
      }
      if (users[removeIdx].id === this.baseComponent.data.currentUserId) {
        this.baseComponent.setProps({
          isHide: true,
          users: [],
          searchString: '',
        })
        this.emit(
          UserListController.emits.liveChat,
          this.baseComponent.data.chatId
        )
        return
      }
      users.splice(removeIdx, 1)
    })
    this.baseComponent.setProps({ users })
  }

  private _close() {
    this.baseComponent.setProps({ isHide: true, users: [], searchString: '' })
  }

  private _updateCurrentUser(user: UserResponse) {
    this.baseComponent.setProps({ currentUserId: user.id })
  }

  private _updateUserList(chatId: number, users: ChatUserResponse) {
    this.baseComponent.setProps({ users, isHide: false, chatId })
  }
}
