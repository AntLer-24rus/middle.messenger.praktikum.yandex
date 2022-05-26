import { defineHBSComponent } from '../../utils'
import renderer from './overlay.hbs'
import * as classes from './overlay.module.scss'

export default defineHBSComponent({
  name: 'Overlay',
  renderer,
  props: { classes, isHide: true },
})
