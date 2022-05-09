import renderer from './login.hbs'
import * as classes from './style.module.scss'
import { defineHBSComponent, validator } from '../../utils'
import { Button, TextField, Card } from '../../components'

export default defineHBSComponent({
  name: 'LoginPage',
  components: [TextField, Button, Card],
  renderer,
  props: {},
  data: () => ({
    classes,
    inputs: [
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
    ],
    buttons: [
      {
        text: 'Войти',
        type: 'filled',
        click: () => {},
      },
      {
        text: 'Нет аккаунта?',
        type: 'stroke',
        click: (e: Event) => {
          e.preventDefault()
          console.log('Нет аккаунта?')
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
          const error = validator(el.name, el.value)
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
      console.log('form :>> ', formData)
    },
  },
})
