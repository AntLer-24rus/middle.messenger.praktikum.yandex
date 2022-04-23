import template from './dev-panel.hbs'
import * as classes from './style.module.scss'

export default {
  name: 'dev-panel',
  render: ({ pages = [], rerender = () => {} } = {}) => {
    window.linkHandler = (event) => {
      event.preventDefault()
      window.history.pushState({}, '', event.target.pathname)
      rerender()
    }
    const additionalPages = ['/unknown', '/error']
    return template({
      pages: [
        ...pages
          .concat(additionalPages)
          .map((i) => ({ href: i, text: i.slice(1) })),
      ],
      classes,
    })
  },
}
