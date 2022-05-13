import renderer from './button.hbs'
import * as classes from './style.module.scss'
import { defineHBSComponent } from '../../utils'

type ButtonData = {
  isStroke: boolean
}
type ButtonProps = {
  classes: typeof classes.default
  type: 'stroke' | 'filled'
}

export default defineHBSComponent<ButtonData, ButtonProps>({
  name: 'Button',
  props: {
    classes: classes as unknown as typeof classes.default,
    type: 'stroke',
  },
  renderer,
  data() {
    return {
      isStroke: this.type === 'stroke',
    }
  },
  nativeEvents: {
    buttonClick(e: Event) {
      this.emit('Button:click', e)
    },
  },
})
