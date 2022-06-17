import { ChatUserResponse } from '../../../../type/api'
import { Component, defineHBSComponent } from '../../../../utils'
import renderer from './user-view.hbs'
import classes from './user-view.module.scss'

type UserViewProps = {
  userInfo: ChatUserResponse[number]
  currentUserId: number
}

type UserViewData = {
  classes: typeof classes
  isAdmin: boolean
  isCurrentUser: boolean
  isInteract: boolean
  avatar(this: UserViewData & UserViewProps): string | null
  avatarAlt: (this: UserViewData & UserViewProps) => string
  interactUser: (this: Component) => void
  interactIcon: (this: UserViewProps & UserViewData) => string
  interactClass: (this: UserViewProps & UserViewData) => string
}
const props: UserViewProps = {
  currentUserId: 1,
  userInfo: {
    avatar: null,
    display_name: null,
    email: '',
    first_name: '',
    id: 1,
    login: '',
    phone: '',
    role: '',
    second_name: '',
  },
}
const emits = {
  removeUser: 'UserView:removeUser',
  addUser: 'UserView:addUser',
}
const UserView = defineHBSComponent({
  name: 'UserView',
  renderer,
  emits,
  props,
  data(): UserViewData {
    return {
      classes,
      isAdmin: this.userInfo.role === 'admin',
      isCurrentUser: this.userInfo.id === this.currentUserId,
      isInteract:
        this.userInfo.role !== 'admin' &&
        this.userInfo.id !== this.currentUserId,
      avatar() {
        return this.userInfo.avatar
          ? `https://ya-praktikum.tech/api/v2/resources${this.userInfo.avatar}`
          : this.userInfo.avatar
      },
      avatarAlt() {
        /* eslint-disable camelcase */
        const { display_name, first_name, second_name } = this.userInfo
        return display_name
          ? display_name
              .split(' ')
              .map((word) => word[0])
              .slice(0, 2)
              .join('')
          : `${first_name[0]}${second_name[0]}`
        /* eslint-enable camelcase */
      },
      interactUser() {
        const userView = this.getParentByName('UserView')! as InstanceType<
          typeof UserView
        >

        if (userView.data.userInfo.role === 'external') {
          userView.emit(emits.addUser, userView.data.userInfo.id)
        } else {
          userView.emit(emits.removeUser, userView.data.userInfo.id)
        }
      },
      interactIcon() {
        return this.userInfo.role === 'external' ? 'plus' : 'trash'
      },
      interactClass() {
        return this.userInfo.role === 'external'
          ? this.classes['user-view__add-icon']
          : this.classes['user-view__remove-icon']
      },
    }
  },
})

export default UserView
