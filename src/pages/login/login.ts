import renderer from './login.hbs'
import * as classes from './style.module.scss'
import {
  collectFieldValues,
  Component,
  defineHBSComponent,
  validator,
} from '../../utils'
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
        click(this: Component, e: Event) {
          e.preventDefault()
          e.stopPropagation()

          const loginPage = this.getParentByName('LoginPage')!
          const card = loginPage.getChildrenByName('Card')!
          const textFields = card.children.filter((c) => c.name === 'TextField')
          const formData = collectFieldValues(textFields)
          console.log('login data :>> ', formData)
        },
      },
      {
        text: 'Нет аккаунта?',
        type: 'stroke',
        click(e: Event) {
          e.preventDefault()
          e.stopPropagation()
          console.log('Нет аккаунта?')
        },
      },
    ],
  }),
})
