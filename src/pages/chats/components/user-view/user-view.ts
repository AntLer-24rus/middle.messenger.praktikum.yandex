import renderer from './user-view.hbs'
import * as classes from './user-view.module.scss'
import { Component, defineHBSComponent } from '../../../../utils'

type UserViewProps = {
  classes: typeof classes
  userName: string
  status: string
}

type UserViewData = {
  avatar: string
  removeUser: (this: Component) => void
}

export default defineHBSComponent<UserViewData, UserViewProps>({
  name: 'UserView',
  renderer,
  props: { classes, userName: 'Default user name', status: 'offline' },
  data(this: UserViewProps) {
    return {
      avatar: this.userName
        .split(' ')
        .map((i) => i[0])
        .join(''),
      removeUser() {
        this.parent!.emit('UserView:removeUser', this.id)
      },
    }
  },
})
