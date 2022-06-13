import { defineHBSComponent } from '../../utils'
import renderer from './card.hbs'
import classes from './card.module.scss'

type CardPropsType = {
  className?: string
  title?: string
}

type CardDataType = {
  classes: typeof classes
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
      classes,
    }
  },
})
