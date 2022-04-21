import template from './registration.hbs'
import * as classes from './style.module.scss'
import modules from '../../modules'

const inputs = [
  {
    name: 'email',
    label: 'Почта',
    placeholder: 'Ваша почта',
  },
  {
    name: 'first-name',
    label: 'Имя',
    placeholder: 'Ваше имя',
  },
  {
    name: 'second-name',
    label: 'Фамилия',
    placeholder: 'Ваша фамилия',
  },
  {
    name: 'phone',
    label: 'Телефон',
    placeholder: 'Ваш телефон',
  },
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
  {
    name: 'confirm-password',
    label: 'Пароль (ещё раз)',
    placeholder: 'Ваш пароль ещё раз',
    error: 'Неверный пароль',
  },
]

const buttons = [
  {
    text: 'Зарегистрироваться',
    type: 'filled',
  },
  {
    text: 'Уже есть аккаунт?',
    type: 'stroke',
  },
]

export default {
  name: 'registration-page',
  render: () => {
    return template(
      {
        inputs,
        buttons,
        classes,
      },
      {
        partials: {
          'text-field': modules.get('text-field').render,
          button: modules.get('button').render,
        },
      }
    )
  },
}
