import { Icon, TextField } from '../../../../components'
import {
  collectFieldValues,
  Component,
  defineHBSComponent,
  Router,
  validator,
} from '../../../../utils'
import renderer from './profile.hbs'
import * as classes from './profile.module.scss'

type ProfileProps = {
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

type HBSContext<P> = {
  data: {
    key?: string
    root?: P & ProfileProps
  }
}

type ProfileData = {
  classes: typeof classes.default
  isEdit: boolean
  avatar: string
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
  close: (this: Component<ProfileData, ProfileProps>) => void
  exit: () => void
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
const emits = {}

export default defineHBSComponent<ProfileProps, typeof emits, ProfileData>({
  name: 'Profile',
  renderer,
  emits,
  props,
  components: [Icon, TextField],
  data() {
    return {
      classes: classes as unknown as typeof classes.default,
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
        const { isEdit } = profileComp.data
        let { profile } = profileComp.data

        if (isEdit) {
          const card = profileComp.getChildrenByName('Card')!
          const children = card.children as unknown as ReadonlyArray<Component>
          const isTextField = (c: InstanceType<typeof TextField>) =>
            c.name === 'TextField'
          const textFields = children.filter(isTextField)
          const formData = collectFieldValues(textFields)
          global.console.log('save', formData)
          if (!formData.valid) return
          profile = formData.data as typeof profile
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
      exit() {
        Router.instance().go('/')
      },
    }
  },
  DOMEvents: {
    changeAvatar() {
      if (this.data.isEdit) {
        this.data.error = 'Ошибка смены аватара'
      }
    },
  },
})
