import { Card, Icon } from '../../../../components'
import { Component, defineHBSComponent } from '../../../../utils'
import UserView from '../user-view'
import renderer from './user-list.hbs'
import * as classes from './user-list.module.scss'

type UserListProps = {
  classes: typeof classes
  users: {
    name: string
    status: string
  }[]
}
type UserListData = {
  hideUserList: (this: Component) => void
  removeUser: (this: Component, user: any) => void
  removeChat: (this: Component) => void
}

export default defineHBSComponent<UserListData, UserListProps>({
  name: 'UserList',
  renderer,
  props: {
    classes,
    users: [
      {
        name: 'User 1',
        status: 'online',
      },
      {
        name: 'User 2',
        status: 'online',
      },
      {
        name: 'User 3',
        status: 'online',
      },
      {
        name: 'User 4',
        status: 'online',
      },
      {
        name: 'User 5',
        status: 'online',
      },
    ],
  },
  components: [Card, Icon, UserView],
  data() {
    return {
      hideUserList() {
        const overlay = this.getParentByName('Overlay')!
        overlay.hide()
      },
      removeUser(user: any) {
        console.log('Удалить юзера', user)
      },
      removeChat() {
        console.log('Удалить чат', this.id)
      },
    }
  },
})
