import * as classes from './card.module.scss'
import renderer from './card.hbs'
import { defineHBSComponent } from '../../utils'

type CardPropsType = {
  className?: string
  title?: string
}

type CardDataType = {
  classes: typeof classes.default
}

const props: CardPropsType = {}
const emits = {}

export default defineHBSComponent({
  name: 'Card',
  renderer,
  emits,
  props,
  data(): CardDataType {
    return {
      classes: classes as unknown as typeof classes.default,
    }
  },
})
