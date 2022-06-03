import renderer from './button.hbs'
import * as classes from './button.module.scss'
import { defineHBSComponent } from '../../utils'

type ButtonProps = {
  type: 'stroke' | 'filled'
}

type ButtonData = {
  classes: typeof classes.default
  isStroke: boolean
}

const props: ButtonProps = { type: 'stroke' }
const emits = {
  click: 'Button:click',
}
export default defineHBSComponent({
  name: 'Button',
  renderer,
  emits,
  props,
  data(): ButtonData {
    return {
      classes: classes as unknown as typeof classes.default,
      isStroke: this.type === 'stroke',
    }
  },
  DOMEvents: {
    buttonClick(e) {
      e.preventDefault()
      e.stopPropagation()

      this.emit(emits.click, e)
    },
  },
})
