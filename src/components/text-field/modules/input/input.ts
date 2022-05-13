import renderer from './input.hbs'
import { defineHBSComponent } from '../../../../utils'

export default defineHBSComponent({
  name: 'Input',
  renderer,
  props: { disabled: true },
  nativeEvents: {
    blur(e: Event) {
      e.stopPropagation()
      const { value } = e.target as HTMLInputElement
      this.emit('Input:blur', value)
    },
    focus(e: Event) {
      e.stopPropagation()
      const { value } = e.target as HTMLInputElement
      this.emit('Input:focus', value)
    },
  },
})
