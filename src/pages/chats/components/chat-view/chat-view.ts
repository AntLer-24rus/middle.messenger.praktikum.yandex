import renderer from './chat-view.hbs'
import * as classes from './chat-view.module.scss'
import { Component, defineHBSComponent } from '../../../../utils'
import { Message } from '../message'
import { Icon, TextField } from '../../../../components'

type Message = {
  isSend: boolean
  type: 'income' | 'send'
  text: string
  date: Date
}

type ChatViewProps = {
  className?: string
  messages?: Message[]
  chatName: string
}
type HBSContext<P> = {
  data: {
    key?: string
    root?: P & ChatViewProps
  }
}
type ChatViewData = {
  classes: typeof classes.default
  messageClass: (this: Message, ctx: HBSContext<ChatViewData>) => string
  showChatInfo: (
    this: Component<ChatViewData & ChatViewProps>,
    e: Event
  ) => void
}

const props: ChatViewProps = {
  chatName: '',
}
const emits = {}

export default defineHBSComponent({
  name: 'ChatView',
  renderer,
  emits,
  props,
  components: [Message, Icon, TextField],
  data(): ChatViewData {
    return {
      classes: classes as unknown as typeof classes.default,
      showChatInfo(this: Component, e: Event) {
        this.parent!.emit('ChatView:showChatInfo', e)
      },
      messageClass() {
        const cls = classes as unknown as typeof classes.default
        const messageClasses = [cls.message]
        if (this.isSend) messageClasses.push(cls.message_send)
        else messageClasses.push(cls.message_income)
        return messageClasses.join(' ')
      },
    }
  },
})
