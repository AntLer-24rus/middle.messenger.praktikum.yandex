import renderer from './input.hbs'
import { defineHBSComponent } from '../../../../utils'

export default defineHBSComponent({
  name: 'Input',
  renderer,
  props: { disabled: true },
  nativeEvents: {
    blur(e: Event) {
      this.emit('Input:blur', e)
    },
    focus(e: Event) {
      this.emit('Input:focus', e)
    },
  },
})
