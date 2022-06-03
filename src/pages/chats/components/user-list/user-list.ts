import { Card, Icon, Overlay } from '../../../../components'
import { Component, defineHBSComponent } from '../../../../utils'
import { UserView } from '../user-view'
import renderer from './user-list.hbs'
import * as classes from './user-list.module.scss'

type UserListProps = {
  users: {
    name: string
    status: string
  }[]
}
type UserListData = {
  classes: typeof classes.default
  hideUserList: (this: Component) => void
  removeUser: (this: Component, user: any) => void
  removeChat: (this: Component) => void
}

const props: UserListProps = {
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
}
const emits = {}

export default defineHBSComponent({
  name: 'UserList',
  renderer,
  emits,
  props,
  components: [Card, Icon, UserView, Overlay],
  data(): UserListData {
    return {
      classes: classes as unknown as typeof classes.default,
      hideUserList() {
        const overlay = this.getParentByName('Overlay')!
        overlay.hide()
      },
      removeUser(user: any) {
        global.console.log('Удалить юзера', user)
      },
      removeChat() {
        global.console.log('Удалить чат', this.id)
      },
    }
  },
})
