import template from './input.hbs'
import * as classes from './style.module.scss'

export default {
  name: 'text-field',
  render: (data) => {
    console.log('data :>> ', data)
    return template({ ...data, classes })
  },
}
