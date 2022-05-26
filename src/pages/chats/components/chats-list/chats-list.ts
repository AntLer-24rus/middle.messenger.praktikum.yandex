import renderer from './chats-list.hbs'
import * as classes from './chats-list.module.scss'
import { defineHBSComponent } from '../../../../utils'
import { ChatPreview } from '../chat-preview'

type ChatListProps = {
  classes: typeof classes
  className: string
}
type ChatListData = unknown

export default defineHBSComponent<ChatListData, ChatListProps>({
  name: 'ChatList',
  renderer,
  props: { classes, className: '' },
  components: [ChatPreview],
})
