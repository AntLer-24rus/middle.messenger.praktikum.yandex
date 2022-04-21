import template from './chats.hbs'
import * as classes from './style.module.scss'

export default {
  name: 'chats-page',
  render: () => {
    return template({ classes })
  },
}
