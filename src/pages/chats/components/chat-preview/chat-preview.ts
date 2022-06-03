import renderer from './chat-preview.hbs'
import * as classes from './chat-preview.module.scss'
import { defineHBSComponent } from '../../../../utils'

type ChatPreviewProps = {
  className?: string
}

type ChatPreviewData = {
  classes: typeof classes.default
}

const props: ChatPreviewProps = {}
const emits = {}
export default defineHBSComponent({
  name: 'ChatPreview',
  renderer,
  emits,
  props,
  data(): ChatPreviewData {
    return {
      classes: classes as unknown as typeof classes.default,
    }
  },
})
