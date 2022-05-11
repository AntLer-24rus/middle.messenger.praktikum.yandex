import renderer from './chat-view.hbs'
import classes from './chat-view.module.scss'
import { defineHBSComponent } from '../../../../utils'
import Message from '../message'
import { Icon, TextField } from '../../../../components'

type ChatViewProps = {
  classes: typeof classes
  className: string
}
type ChatViewData = unknown

export default defineHBSComponent<ChatViewData, ChatViewProps>({
  name: 'ChatView',
  renderer,
  props: { classes, className: '' },
  components: [Message, Icon, TextField],
  data() {
    return {
      showChatInfo() {
        console.log('Показать информацию чата')
      },
    }
  },
})
