import { defineHBSComponent } from '../../utils'
import renderer from './overlay.hbs'
import * as classes from './overlay.module.scss'

type OverlayProps = {
  isHide: boolean
}

type OverlayData = {
  classes: typeof classes.default
}

const props: OverlayProps = {
  isHide: true,
}
const emits = {}

export default defineHBSComponent({
  name: 'Overlay',
  renderer,
  emits,
  props,
  data(): OverlayData {
    return {
      classes: classes as unknown as typeof classes.default,
    }
  },
})
