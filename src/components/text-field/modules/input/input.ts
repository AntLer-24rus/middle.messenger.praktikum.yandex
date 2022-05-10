import renderer from './input.hbs'
import { defineHBSComponent } from '../../../../utils'

export default defineHBSComponent({
  name: 'Input',
  renderer,
  nativeEvents: {
    blur(e: Event) {
      this.emit('Input:blur', e)
    },
    focus(e: Event) {
      this.emit('Input:focus', e)
    },
  },
})
