import template from './button.hbs'
import * as classes from './style.module.scss'

export default {
  name: 'button',
  render: (data) => {
    const isStroke = data.type === 'stroke'
    return template({ ...data, isStroke, classes })
  },
}
