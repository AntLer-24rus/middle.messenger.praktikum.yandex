import renderer from './registration.hbs'
import * as classes from './registration.module.scss'

import {
  collectFieldValues,
  Component,
  defineHBSComponent,
  Router,
  validator,
} from '../../utils'
import { Button, TextField, Card } from '../../components'

export default defineHBSComponent({
  name: 'RegistrationPage',
  components: [TextField, Button, Card],
  renderer,
  props: { classes },
  data: () => ({
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
        click(this: Component, e: Event) {
          e.preventDefault()
          e.stopPropagation()
          const registrationPage = this.getParentByName('RegistrationPage')!
          const card = registrationPage.getChildrenByName('Card')!
          const textFields = card.children.filter((c) => c.name === 'TextField')
          const formData = collectFieldValues(textFields)
          global.console.log('registration data :>> ', formData)
        },
      },
      {
        text: 'Уже есть аккаунт?',
        type: 'stroke',
        click(e: Event) {
          e.preventDefault()
          e.stopPropagation()
          Router.instance().go('/')
        },
      },
    ],
  }),
})
