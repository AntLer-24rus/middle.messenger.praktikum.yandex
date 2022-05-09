import renderer from './button.hbs'
import classes from './style.module.scss'
import { defineHBSComponent } from '../../utils'

export default defineHBSComponent({
  name: 'Button',
  props: {
    type: 'stoke',
  },
  renderer,
  data() {
    return {
      classes,
      //@ts-ignore
      isStroke: this.type === 'stroke',
    }
  },
  nativeEvents: {
    buttonClick(e: Event) {
      this.emit('Button:click', e)
    },
  },
})
