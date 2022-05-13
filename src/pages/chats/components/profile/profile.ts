import { Icon, TextField } from '../../../../components'
import { Component, defineHBSComponent, validator } from '../../../../utils'
import renderer from './profile.hbs'
import * as classes from './profile.module.scss'

type ProfileProps = {
  classes: typeof classes
  isCurrentUser: boolean
  profile: {
    email: string
    login: string
    first_name: string
    second_name: string
    display_name: string
    phone: string
  }
  error: string
  isHide: boolean
}

type ProfileData = unknown

const fieldLabels = {
  email: 'Почта',
  login: 'Логин',
  first_name: 'Имя',
  second_name: 'Фамилия',
  display_name: 'Имя в чате',
  phone: 'Телефон',
}
const fieldPlaceholder = {
  email: 'Ваша почта',
  login: 'Ваш логин',
  first_name: 'Ваше имя',
  second_name: 'Ваша фамилия',
  display_name: 'Ваше имя в чате',
  phone: 'Ваш телефон',
}

export default defineHBSComponent<ProfileData, ProfileProps>({
  name: 'Profile',
  renderer,
  props: {
    classes,
    isCurrentUser: true,
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
  },
  components: [Icon, TextField],
  data(this: ProfileProps) {
    return {
      isEdit: false,
      avatar: this.profile.display_name
        .split(' ')
        .map((i) => i[0])
        .join(''),
      label({ data: { key } }: any) {
        //@ts-ignore
        return fieldLabels[key]
      },
      placeholder({ data: { key } }: any) {
        //@ts-ignore
        return fieldPlaceholder[key]
      },
      createValidator({ data: { key } }: any) {
        return validator.bind(null, key)
      },
      icon({ data: { root } }: any) {
        return root.isEdit ? 'done' : 'edit'
      },
      disableInput({ data: { root } }: any) {
        return !root.isEdit
      },
      inputClasses({ data: { root } }: any) {
        //@ts-ignore
        const inputClasses = [classes.profile__input]
        if (root.isEdit)
          //@ts-ignore
          inputClasses.push(classes.profile__input_edit)
        return inputClasses.join(' ')
      },
      editProfile(this: Component) {
        const profile = this.getParentByName('Profile')
        profile!.setProps({ isEdit: !profile!.data.isEdit })
      },
      close(this: Component) {
        const profile = this.getParentByName('Profile')!
        profile.setProps({ isHide: true, isEdit: false })
      },
    }
  },
  nativeEvents: {
    changeAvatar() {
      //@ts-ignore
      if (!this.isEdit) return
      return {
        error: 'Ошибка смены аватара',
      }
    },
  },
})
