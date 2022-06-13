import { defineHBSComponent } from '../../utils'
import renderer from './button.hbs'
import classes from './button.module.scss'

type ButtonProps = {
  text: string
  type: 'stroke' | 'filled'
}

type ButtonData = {
  classes: typeof classes
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
      classes,
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
