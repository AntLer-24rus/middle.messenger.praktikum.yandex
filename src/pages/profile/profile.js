import template from './profile.hbs'
import * as classes from './style.module.scss'

export default {
  name: 'profile-page',
  render: () => {
    return template({ classes })
  },
}
