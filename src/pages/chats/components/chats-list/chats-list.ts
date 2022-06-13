import { defineHBSComponent } from '../../../../utils'
import { ChatPreview } from '../chat-preview'
import renderer from './chats-list.hbs'
import classes from './chats-list.module.scss'

type ChatListProps = {
  className: string
  chats: any[]
}
type ChatListData = {
  classes: typeof classes
  selectedChatId: number | null
  selectChat(this: InstanceType<typeof ChatPreview>): void
}

const props: ChatListProps = {
  className: '',
  chats: [],
}
const emits = {
  select: 'ChatList:select',
}
export default defineHBSComponent({
  name: 'ChatList',
  renderer,
  emits,
  props,
  components: [ChatPreview],
  data(): ChatListData {
    return {
      classes,
      selectedChatId: null,
      selectChat() {
        const chatList = this.getParentByName('ChatList')!
        const chatsPreviews = chatList.children.filter(
          ({ name }) => name === 'ChatPreview'
        ) as InstanceType<typeof ChatPreview>[]

        // function clearSelection(e: KeyboardEvent) {
        //   e.stopPropagation()
        //   e.preventDefault()

        //   if (e.key === 'Escape') {
        //     chatList.data.selectedChatId = null
        //     chatList.needUpdate = false
        //     chatList.emit(emits.select, null)
        //     chatsPreviews.forEach((cp) => cp.setProps({ selected: false }))
        //   }
        // }
        // document.removeEventListener('keyup', clearSelection)
        // document.addEventListener('keyup', clearSelection)

        chatsPreviews.forEach((cp) => cp.setProps({ selected: false }))
        this.setProps({ selected: true })
        chatList.data.selectedChatId = this.data.chatInfo.id
        chatList.needUpdate = false
        chatList.emit(emits.select, this.data.chatInfo.id)
      },
    }
  },
})
