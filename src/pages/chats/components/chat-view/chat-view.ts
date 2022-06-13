import { Icon, TextField } from '../../../../components'
import { Component, defineHBSComponent } from '../../../../utils'
import { Message } from '../message'
import renderer from './chat-view.hbs'
import classes from './chat-view.module.scss'

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
  classes: typeof classes
  messageClass: (this: Message, ctx: HBSContext<ChatViewData>) => string
  showChatInfo: (
    this: Component<ChatViewData & ChatViewProps>,
    e: Event
  ) => void
  sendMessage: (this: InstanceType<typeof TextField>, message: string) => void
}

const props: ChatViewProps = {
  chatName: '',
}
const emits = {
  sendMessage: 'ChatView:sendMessage',
}

const ChatView = defineHBSComponent({
  name: 'ChatView',
  renderer,
  emits,
  props,
  components: [Message, Icon, TextField],
  data(): ChatViewData {
    return {
      classes,
      showChatInfo(this: Component, e: Event) {
        this.parent!.emit('ChatView:showChatInfo', e)
      },
      messageClass() {
        const messageClasses = [classes.message]
        if (this.isSend) messageClasses.push(classes.message_send)
        else messageClasses.push(classes.message_income)
        return messageClasses.join(' ')
      },
      sendMessage(message) {
        const chatView = this.getParentByName('ChatView') as InstanceType<
          typeof ChatView
        >
        chatView.emit(ChatView.emits.sendMessage, message)
        this.setProps({ value: '' })
      },
    }
  },
})

export default ChatView
