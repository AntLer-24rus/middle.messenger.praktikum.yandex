import template from './dev-panel.hbs'

export default {
  name: 'dev-panel',
  render: ({ pages = [], rerender = () => {} } = {}) => {
    window.linkHandler = (event) => {
      event.preventDefault()
      window.history.pushState({}, '', event.target.pathname)
      rerender()
    }
    return template({
      pages: [...pages.map((i) => i.replace('/', '')), 'unknown', 'error'],
    })
  },
}
