import template from './login.hbs'

export default {
  name: 'login-page',
  render: () => {
    return template({ value: 'test value' })
  },
}
