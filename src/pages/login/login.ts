import renderer from './login.hbs'
import * as classes from './login.module.scss'
import {
  collectFieldValues,
  Component,
  defineHBSComponent,
  validator,
  Router,
} from '../../utils'
import { Button, TextField, Card } from '../../components'

type LoginPageProps = Record<string, never>
type LoginPageData = {
  classes: typeof classes.default
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

const props: LoginPageProps = {}
const emits = {}

export default defineHBSComponent({
  name: 'LoginPage',
  renderer,
  emits,
  props,
  components: [TextField, Button, Card],
  data(): LoginPageData {
    return {
      classes: classes as unknown as typeof classes.default,
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
          click(e) {
            e.preventDefault()
            e.stopPropagation()

            const loginPage = this.getParentByName('LoginPage')!
            const card = loginPage.getChildrenByName('Card')!
            const children =
              card.children as unknown as ReadonlyArray<Component>
            const isTextField = (c: InstanceType<typeof TextField>) =>
              c.name === 'TextField'
            const textFields = children.filter(isTextField)
            const formData = collectFieldValues(textFields)
            global.console.log('login data :>> ', formData)
          },
        },
        {
          text: 'Нет аккаунта?',
          type: 'stroke',
          click(e: Event) {
            e.preventDefault()
            e.stopPropagation()
            Router.instance().go('/signup')
          },
        },
      ],
    }
  },
})
