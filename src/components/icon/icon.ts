import renderer from './icon.hbs'
import * as classes from './icon.module.scss'
import { defineHBSComponent } from '../../utils'

type IconProps = {
  iconName: string
  className?: string
}

type IconData = {
  classes: typeof classes.default
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
      classes: classes as unknown as typeof classes.default,
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
