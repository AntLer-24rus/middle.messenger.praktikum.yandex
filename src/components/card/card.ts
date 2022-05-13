import * as classes from './card.module.scss'
import renderer from './card.hbs'
import { defineHBSComponent } from '../../utils'

export default defineHBSComponent({
  name: 'Card',
  renderer,
  props: { classes },
})
