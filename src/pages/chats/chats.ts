import template from './chats.hbs'
import * as classes from './style.module.scss'

export const chatsPage = {
  name: 'chats-page',
  render: () => {
    return template({ classes })
  },
}
