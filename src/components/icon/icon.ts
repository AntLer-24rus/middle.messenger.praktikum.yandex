import renderer from './icon.hbs'
import classes from './icon.module.scss'

import { defineHBSComponent } from '../../utils'

type IconProps = {
  classes: typeof classes
  iconName: string
  className: string
}
type IconData = unknown

export default defineHBSComponent<IconData, IconProps>({
  name: 'Icon',
  renderer,
  props: { classes, iconName: 'setting', className: '' },
  nativeEvents: {
    iconClick(e: Event) {
      this.emit('Icon:click', e)
    },
  },
})
