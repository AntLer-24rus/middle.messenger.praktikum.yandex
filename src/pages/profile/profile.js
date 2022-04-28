import template from './profile.hbs'
import * as classes from './style.module.scss'

export const profilePage = {
  name: 'profile-page',
  render: () => {
    return template({ classes })
  },
}
