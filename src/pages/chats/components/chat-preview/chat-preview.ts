import { ChatsResponse } from '../../../../type/api'
import { defineHBSComponent } from '../../../../utils'
import renderer from './chat-preview.hbs'
import * as classes from './chat-preview.module.scss'

type ChatPreviewProps = {
  className?: string
  chatInfo: ChatsResponse
  selected: boolean
}

type ChatPreviewData = {
  classes: typeof classes.default
  hasUnread: boolean
  avatarAlt: string
}

const props: ChatPreviewProps = {
  selected: false,
  chatInfo: {
    id: 1,
    title: '',
    avatar: null,
    last_message: null,
    unread_count: 0,
  },
}
const emits = {
  click: 'ChatPreview:click',
}
export default defineHBSComponent({
  name: 'ChatPreview',
  renderer,
  emits,
  props,
  data(): ChatPreviewData {
    return {
      classes: classes as unknown as typeof classes.default,
      hasUnread: this.chatInfo.unread_count > 0,
      avatarAlt: this.chatInfo.title
        .split(' ')
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join(''),
    }
  },
  DOMEvents: {
    chatClick(e) {
      e.preventDefault()
      e.stopPropagation()

      this.emit(emits.click, this.data.chatInfo.id)
    },
  },
})
