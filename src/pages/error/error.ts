import template from './error.hbs'
import * as classes from './style.module.scss'
import { button } from '../../modules'

const buttonData = {
  text: 'Назад к чатам',
  type: 'stroke',
}

export const errorPage = {
  name: 'error-page',
  render: (data) => {
    return template(
      { ...data, button: buttonData, classes },
      {
        partials: {
          button: button.render,
        },
      }
    )
  },
}
