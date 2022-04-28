import template from './button.hbs'
import * as classes from './style.module.scss'

export const button = {
  name: 'button',
  render: (data) => {
    const isStroke = data.type === 'stroke'
    return template({ ...data, isStroke, classes })
  },
}
