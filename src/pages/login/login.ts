import { Button, Card, TextField } from '../../components'
import { collectFieldValues, defineHBSComponent, validator } from '../../utils'
import renderer from './login.hbs'
import * as classes from './login.module.scss'

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
const emits = {
  signIn: 'LoginPage:signin',
  signUp: 'LoginPage:signUp',
}

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
            const textFields = card.children.filter(
              ({ name }) => name === 'TextField'
            )
            const formData = collectFieldValues(textFields)
            if (formData.valid) {
              loginPage.emit(emits.signIn, formData.data)
            }
          },
        },
        {
          text: 'Нет аккаунта?',
          type: 'stroke',
          click(e) {
            e.preventDefault()
            e.stopPropagation()

            const loginPage = this.getParentByName('LoginPage')!
            loginPage.emit(emits.signUp)
          },
        },
      ],
    }
  },
})
