import renderer from './chat-preview.hbs'
import * as classes from './chat-preview.module.scss'
import { defineHBSComponent } from '../../../../utils'

export default defineHBSComponent({
  name: 'ChatPreview',
  renderer,
  props: { classes },
})
