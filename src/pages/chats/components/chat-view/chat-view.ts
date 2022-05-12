import renderer from './chat-view.hbs'
import * as classes from './chat-view.module.scss'
import { Component, defineHBSComponent } from '../../../../utils'
import Message from '../message'
import { Icon, TextField, Overlay, Card } from '../../../../components'

type ChatViewProps = {
  classes: typeof classes
  className: string
}
type ChatViewData = unknown

export default defineHBSComponent<ChatViewData, ChatViewProps>({
  name: 'ChatView',
  renderer,
  props: { classes, className: '' },
  components: [Message, Icon, TextField, Overlay, Card],
  data() {
    return {
      showChatInfo(this: Component, e: Event) {
        this.parent!.emit('ChatView:showChatInfo', e)
      },
    }
  },
})
