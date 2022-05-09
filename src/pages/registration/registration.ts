import renderer from './registration.hbs'
import * as classes from './style.module.scss'

import { defineHBSComponent, validator } from '../../utils'
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
        click: () => {},
      },
      {
        text: 'Уже есть аккаунт?',
        type: 'stroke',
        click: (e: Event) => {
          e.preventDefault()
          console.log('Уже есть аккаунт?')
        },
      },
    ],
  }),
  nativeEvents: {
    signin(e: Event) {
      e.preventDefault()
      const form = e.target as HTMLFormElement
      const data: Record<string, string> = {}
      const localInputs = []
      for (const el of form.elements) {
        if (el instanceof HTMLInputElement) {
          data[el.name] = el.value
          let error
          if (el.name === 'confirm_password')
            error = validator('password', el.value)
          else error = validator(el.name, el.value)
          const input = this.inputs.find((i) => i.name === el.name)
          localInputs.push({ ...input!, error })
        }
      }
      this.inputs = localInputs
      const formData = {
        data,
        valid: this.inputs.every((i) => !i.error),
        errors: Object.fromEntries(this.inputs.map((i) => [i.name, i.error])),
      }
      if (formData.data.password !== formData.data.confirm_password) {
        formData.valid = false
        formData.errors['confirm_password'] = 'Пароли не совпадают!'
      }
      console.log('form :>> ', formData)
    },
  },
})
