/* eslint camelcase: ["error", {"properties": "never", ignoreDestructuring: true}] */
import { Icon, TextField } from '../../../../components'
import {
  Component,
  defineHBSComponent,
  HBSComponentInterface,
  validator,
} from '../../../../utils'
import { PasChange } from './paschange'
import renderer from './profile.hbs'
import classes from './profile.module.scss'

type ProfileProps = {
  isCurrentUser: boolean
  profile: {
    email: string
    login: string
    first_name: string
    second_name: string
    display_name: string | null
    phone: string
  }
  avatar: string
  error: string
  isHide: boolean
}

type HBSContext<P> = {
  data: {
    key?: string
    root?: P & ProfileProps
  }
}

type ProfileData = {
  classes: typeof classes
  isEdit: boolean
  userAvatar: (this: ProfileData & ProfileProps) => string
  label: (ctx: HBSContext<ProfileData>) => string
  placeholder: (ctx: HBSContext<ProfileData>) => string
  createValidator: (ctx: HBSContext<ProfileData>) => (arg: string) => string
  icon: (
    this: Component<ProfileData & ProfileProps>,
    ctx: HBSContext<ProfileData>
  ) => string
  disableInput: (ctx: HBSContext<ProfileData>) => boolean
  inputClasses: (ctx: HBSContext<ProfileData>) => string
  editProfile: (this: Component<ProfileData, ProfileProps>) => void
  editPassword: (this: Component<ProfileData, ProfileProps>) => void
  close: (this: Component<ProfileData, ProfileProps>) => void
  exit: (this: Component<ProfileData, ProfileProps>) => void
}

const fieldLabels: Record<string, string> = {
  email: 'Почта',
  login: 'Логин',
  first_name: 'Имя',
  second_name: 'Фамилия',
  display_name: 'Имя в чате',
  phone: 'Телефон',
}
const fieldPlaceholder: Record<string, string> = {
  email: 'Ваша почта',
  login: 'Ваш логин',
  first_name: 'Ваше имя',
  second_name: 'Ваша фамилия',
  display_name: 'Ваше имя в чате',
  phone: 'Ваш телефон',
}

const props: ProfileProps = {
  isCurrentUser: true,
  avatar: '',
  profile: {
    email: 'antler@inbox.ru',
    login: 'AntLer',
    first_name: 'Антон',
    second_name: 'Сатышев',
    display_name: 'AntLer',
    phone: '+79141600607',
  },
  error: '',
  isHide: true,
}
const emits = {
  exit: 'Profile:exit',
  close: 'Profile:close',
  editProfile: 'Profile:editProfile',
  changeAvatar: 'Profile:changeAvatar',
  changePassword: 'Profile:changePassword',
}

export type ProfileInstance = HBSComponentInterface<ProfileData, ProfileProps>

const FIRST_LATTER = 0

export default defineHBSComponent<ProfileProps, typeof emits, ProfileData>({
  name: 'Profile',
  renderer,
  emits,
  props,
  components: [Icon, TextField, PasChange],
  data() {
    return {
      classes,
      isEdit: false,
      userAvatar() {
        const {
          display_name: displayName,
          first_name: firstName,
          second_name: secondName,
        } = this.profile
        return displayName
          ? displayName
              .split(' ')
              .map((word) => word[FIRST_LATTER])
              .slice(0, 2)
              .join('')
          : `${firstName[FIRST_LATTER]}${secondName[FIRST_LATTER]}`
      },
      label({ data: { key } }) {
        if (!key) throw new Error('Неверное использование label()')
        return fieldLabels[key]
      },
      placeholder({ data: { key } }) {
        if (!key) throw new Error('Неверное использование placeholder()')
        return fieldPlaceholder[key]
      },
      createValidator({ data: { key } }) {
        if (!key) throw new Error('Неверное использование createValidator()')
        return validator.bind(null, key)
      },
      icon({ data: { root } }) {
        if (!root) throw new Error('Неверное использование icon()')
        return root.isEdit ? 'done' : 'edit'
      },
      disableInput({ data: { root } }) {
        if (!root) throw new Error('Неверное использование disableInput()')
        return !root.isEdit
      },
      inputClasses({ data: { root } }) {
        if (!root) throw new Error('Неверное использование inputClasses()')
        const inputClasses = [root.classes.profile__input]
        if (root.isEdit) inputClasses.push(root.classes.profile__input_edit)
        return inputClasses.join(' ')
      },
      editProfile() {
        const profile = this.getParentByName('Profile')!
        profile.emit(emits.editProfile)
      },
      editPassword() {
        const profile = this.getParentByName('Profile')!
        profile.emit(emits.changePassword)
      },
      close() {
        const profile = this.getParentByName('Profile')!
        profile.emit(emits.close)
      },
      exit() {
        const profile = this.getParentByName('Profile')!
        profile.emit(emits.exit)
      },
    }
  },
  DOMEvents: {
    changeAvatar() {
      if (this.data.isEdit) {
        this.emit(emits.changeAvatar)
      }
    },
  },
})
