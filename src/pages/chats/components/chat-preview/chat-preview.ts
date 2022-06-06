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
  lastMessageTime: string | null
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

function formateDate(timestamp: string): string {
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${day}.${month} ${hours}:${minutes}:${seconds}`
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
      lastMessageTime: this.chatInfo.last_message
        ? formateDate(this.chatInfo.last_message.time)
        : null,
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
