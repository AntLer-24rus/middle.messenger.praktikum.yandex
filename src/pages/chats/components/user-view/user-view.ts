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
const props: UserViewProps = {
  classes,
  userName: 'Default user name',
  status: 'offline',
}
const emits = {
  removeUser: 'UserView:removeUser',
}
export default defineHBSComponent({
  name: 'UserView',
  renderer,
  emits,
  props,
  data(): UserViewData {
    return {
      avatar: this.userName
        .split(' ')
        .map((i) => i[0])
        .join(''),
      removeUser() {
        const userView = this.getParentByName('UserView')!
        userView.emit(emits.removeUser, this.id)
      },
    }
  },
})
