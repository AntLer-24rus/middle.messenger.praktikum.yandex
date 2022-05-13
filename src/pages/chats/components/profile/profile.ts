import { Icon, TextField } from '../../../../components'
import {
  collectFieldValues,
  Component,
  defineHBSComponent,
  validator,
} from '../../../../utils'
import renderer from './profile.hbs'
import * as classes from './profile.module.scss'

type ProfileProps = {
  classes: typeof classes.default
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

type HBSContext = {
  data: {
    key?: string
    root?: ProfileData & ProfileProps
  }
}

type ProfileData = {
  isEdit: boolean
  avatar: string
  label: (ctx: HBSContext) => string
  placeholder: (ctx: HBSContext) => string
  createValidator: (ctx: HBSContext) => string
  icon: (this: Component<ProfileData & ProfileProps>, ctx: HBSContext) => string
  disableInput: (ctx: HBSContext) => string
  inputClasses: (ctx: HBSContext) => string
  editProfile: (this: Component<ProfileData & ProfileProps>) => void
  close: (this: Component<ProfileData & ProfileProps>) => void
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

export default defineHBSComponent<ProfileData, ProfileProps>({
  name: 'Profile',
  renderer,
  props: {
    //@ts-ignore
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
        const profileComp = this.getParentByName('Profile')!
        const isEdit: boolean = profileComp.data.isEdit

        let profile = profileComp.data.profile

        if (isEdit) {
          const card = profileComp.getChildrenByName('Card')!
          const textFields = card.children.filter((c) => c.name === 'TextField')
          const formData = collectFieldValues(textFields)
          console.log('save', formData)
          if (!formData.valid) return
          profile = formData.data
        }
        profileComp.setProps({ isEdit: !isEdit, profile })
      },
      close() {
        const profile = this.getParentByName('Profile')!
        const card = profile.getChildrenByName('Card')!
        const textFields = card.children.filter((c) => c.name === 'TextField')
        textFields.forEach((tf) => {
          tf.setProps({ error: '' })
        })
        profile.setProps({ isHide: true, isEdit: false, error: '' })
      },
    }
  },
  nativeEvents: {
    changeAvatar() {
      console.log('this :>> ', this)
      if (this.data.isEdit) {
        this.data.error = 'Ошибка смены аватара'
      }
    },
  },
})
