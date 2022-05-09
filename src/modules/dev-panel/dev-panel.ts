import template from './dev-panel.hbs'
import * as classes from './style.module.scss'
import { defineHBSComponent } from '../../utils'

export default defineHBSComponent({
  name: 'DevPanel',
  renderer: template,
  props: {},
  nativeEvents: {
    navigate(e) {
      e.preventDefault()
      const link = e.target as HTMLAnchorElement
      this.emit('update-page', link.pathname)
    },
  },
  data: () => ({
    classes,
  }),
})
