import template from './error.hbs'
import * as classes from './style.module.scss'
import modules from '../../modules'

const button = {
  text: 'Назад к чатам',
  type: 'stroke',
}

export default {
  name: 'error-page',
  render: (data) => {
    return template(
      { ...data, button, classes },
      {
        partials: {
          button: modules.get('button').render,
        },
      }
    )
  },
}
