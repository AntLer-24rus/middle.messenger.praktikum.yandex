import template from './input.hbs'
import * as classes from './style.module.scss'

export const textField = {
  name: 'text-field',
  render: (data) => {
    return template({ ...data, classes })
  },
}
