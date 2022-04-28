import template from './login.hbs'
import * as classes from './style.module.scss'
import { textField, button } from '../../modules'

const inputs = [
  {
    name: 'login',
    label: 'Логин',
    placeholder: 'Ваш логин',
  },
  {
    name: 'password',
    label: 'Пароль',
    placeholder: 'Ваш пароль',
    error: 'Неверный пароль',
  },
]

const buttons = [
  {
    text: 'Войти',
    type: 'filled',
  },
  {
    text: 'Нет аккаунта?',
    type: 'stroke',
  },
]

export const loginPage = {
  name: 'login-page',
  render: () => {
    return template(
      {
        inputs,
        buttons,
        classes,
      },
      {
        partials: {
          'text-field': textField.render,
          button: button.render,
        },
      }
    )
  },
}
