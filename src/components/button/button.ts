import { defineHBSComponent } from '../../utils'
import renderer from './button.hbs'
import * as classes from './button.module.scss'

type ButtonProps = {
  text: string
  type: 'stroke' | 'filled'
}

type ButtonData = {
  classes: typeof classes.default
  isStroke: boolean
}

const defaultProps: ButtonProps = { text: '', type: 'stroke' }
const emits = {
  click: 'Button:click',
}
export default defineHBSComponent({
  name: 'Button',
  renderer,
  emits,
  props: defaultProps,
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
