import { defineHBSComponent } from '../../utils'
import renderer from './icon.hbs'
import classes from './icon.module.scss'

type IconProps = {
  iconName: string
  className?: string
}

type IconData = {
  classes: typeof classes
}

const props: IconProps = {
  iconName: 'setting',
}
const emits = {
  click: 'Icon:click',
}

export default defineHBSComponent({
  name: 'Icon',
  renderer,
  emits,
  props,
  data(): IconData {
    return {
      classes,
    }
  },
  DOMEvents: {
    iconClick(e) {
      e.preventDefault()
      e.stopPropagation()

      this.emit(emits.click, e)
    },
  },
})
