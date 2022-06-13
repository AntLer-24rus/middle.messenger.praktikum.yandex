import { Button, Card, TextField } from '../../components'
import {
  collectFieldValues,
  defineHBSComponent,
  HBSComponentInterface,
  validator,
} from '../../utils'
import renderer from './registration.hbs'
import classes from './registration.module.scss'

type RegistrationPageProps = Record<string, never>

type RegistrationPageData = {
  classes: typeof classes
  inputs: {
    name: string
    label: string
    placeholder: string
    error: string
    validate(arg: string): string
  }[]
  buttons: {
    text: string
    type: 'filled' | 'stroke'
    click(this: InstanceType<typeof Button>, e: Event): void
  }[]
}

const props: RegistrationPageProps = {}
const emits = {
  signIn: 'RegistrationPage:signin',
  signUp: 'RegistrationPage:signUp',
}

export type RegistrationPageInstance = HBSComponentInterface<
  RegistrationPageData,
  RegistrationPageProps
>

export default defineHBSComponent({
  name: 'RegistrationPage',
  renderer,
  emits,
  props,
  components: [TextField, Button, Card],
  data(): RegistrationPageData {
    return {
      classes,
      inputs: [
        {
          name: 'email',
          label: 'Почта',
          placeholder: 'Ваша почта',
          error: '',
          validate: (value: string) => validator('email', value),
        },
        {
          name: 'first_name',
          label: 'Имя',
          placeholder: 'Ваше имя',
          error: '',
          validate: (value: string) => validator('first_name', value),
        },
        {
          name: 'second_name',
          label: 'Фамилия',
          placeholder: 'Ваша фамилия',
          error: '',
          validate: (value: string) => validator('second_name', value),
        },
        {
          name: 'phone',
          label: 'Телефон',
          placeholder: 'Ваш телефон',
          error: '',
          validate: (value: string) => validator('phone', value),
        },
        {
          name: 'login',
          label: 'Логин',
          placeholder: 'Ваш логин',
          error: '',
          validate: (value: string) => validator('login', value),
        },
        {
          name: 'password',
          label: 'Пароль',
          placeholder: 'Ваш пароль',
          error: '',
          validate: (value: string) => validator('password', value),
        },
        {
          name: 'confirm_password',
          label: 'Пароль (ещё раз)',
          placeholder: 'Ваш пароль ещё раз',
          error: '',
          validate: (value: string) => validator('password', value),
        },
      ],
      buttons: [
        {
          text: 'Зарегистрироваться',
          type: 'filled',
          click(e) {
            e.preventDefault()
            e.stopPropagation()

            const registrationPage = this.getParentByName('RegistrationPage')!
            const card = registrationPage.getChildrenByName('Card')!
            const textFields = card.children.filter(
              ({ name }) => name === 'TextField'
            )
            const formData = collectFieldValues(textFields)
            if (formData.valid) {
              registrationPage.emit(emits.signUp, formData.data)
            }
          },
        },
        {
          text: 'Уже есть аккаунт?',
          type: 'stroke',
          click(e: Event) {
            e.preventDefault()
            e.stopPropagation()

            const registrationPage = this.getParentByName('RegistrationPage')!
            registrationPage.emit(emits.signIn)
          },
        },
      ],
    }
  },
})
