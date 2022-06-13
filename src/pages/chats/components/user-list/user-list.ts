import { Card, Icon, Overlay, TextField } from '../../../../components'
import { ChatUserResponse } from '../../../../type/api'
import { Component, defineHBSComponent } from '../../../../utils'
import { UserView } from '../user-view'
import renderer from './user-list.hbs'
import classes from './user-list.module.scss'

type UserListProps = {
  isHide: boolean
  users: ChatUserResponse
  chatId: number
  currentUserId: number
}
type UserListData = {
  classes: typeof classes
  searchString: string
  hideUserList: (this: Component) => void
  removeUser: (this: InstanceType<typeof UserView>, userId: number) => void
  addUser: (this: InstanceType<typeof UserView>, userId: number) => void
  removeChat: (this: Component) => void
  removeChatName: (this: UserListProps & UserListData) => string
  search: (this: InstanceType<typeof TextField>, value: string) => void
}

const props: UserListProps = {
  isHide: true,
  users: [],
  chatId: 1,
  currentUserId: 1,
}
const emits = {
  close: 'UserList:close',
  search: 'UserView:search',
  removeUser: 'UserView:removeUser',
  addUser: 'UserView:addUser',
  removeChat: 'UserView:removeChat',
}

const UserList = defineHBSComponent({
  name: 'UserList',
  renderer,
  emits,
  props,
  components: [Card, Icon, UserView, Overlay],
  data(): UserListData {
    return {
      classes,
      searchString: '',
      hideUserList() {
        const userList = this.getParentByName('UserList') as InstanceType<
          typeof UserList
        >
        userList.emit(emits.close)
      },
      removeUser(userId: number) {
        const userList = this.getParentByName('UserList') as InstanceType<
          typeof UserList
        >
        userList.emit(emits.removeUser, [userId], userList.data.chatId)
      },
      addUser(userId: number) {
        const userList = this.getParentByName('UserList') as InstanceType<
          typeof UserList
        >
        userList.emit(emits.addUser, [userId], userList.data.chatId)
      },
      removeChat() {
        const userList = this.getParentByName('UserList') as InstanceType<
          typeof UserList
        >
        if (userList.data.removeChatName() === 'Удалить чат') {
          userList.emit(emits.removeChat, userList.data.chatId)
        } else {
          userList.emit(
            emits.removeUser,
            [userList.data.currentUserId],
            userList.data.chatId
          )
        }
      },
      removeChatName() {
        const currentUser = this.users.find(
          (user) => this.currentUserId === user.id
        )
        return currentUser && currentUser.role === 'admin'
          ? 'Удалить чат'
          : 'Покинуть чат'
      },
      search(value) {
        const userList = this.getParentByName('UserList') as InstanceType<
          typeof UserList
        >
        userList.data.searchString = value
        userList.needUpdate = false
        userList.emit(emits.search, value)
      },
    }
  },
})

export default UserList
