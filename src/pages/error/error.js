import template from './error.hbs'

export default {
  name: 'error-page',
  render: (data) => {
    return template(data)
  },
}
