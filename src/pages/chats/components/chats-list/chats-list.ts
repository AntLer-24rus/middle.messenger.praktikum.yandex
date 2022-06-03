import renderer from './chats-list.hbs'
import * as classes from './chats-list.module.scss'
import { defineHBSComponent } from '../../../../utils'
import { ChatPreview } from '../chat-preview'

type ChatListProps = {
  className: string
  chats: any[]
}
type ChatListData = {
  classes: typeof classes.default
}

const props: ChatListProps = {
  className: '',
  chats: [],
}
const emits = {}
export default defineHBSComponent({
  name: 'ChatList',
  renderer,
  emits,
  props,
  components: [ChatPreview],
  data(): ChatListData {
    return {
      classes: classes as unknown as typeof classes.default,
    }
  },
})
