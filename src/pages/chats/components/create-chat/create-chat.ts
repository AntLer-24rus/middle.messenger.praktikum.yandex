import { Button, Card, TextField } from '../../../../components'
import { defineHBSComponent } from '../../../../utils'
import renderer from './create-chat.hbs'
import classes from './create-chat.module.scss'

type CreateChatProps = {
  isHide: boolean
}

type CreateChatData = {
  classes: typeof classes
  chatName: string
  create: (this: InstanceType<typeof Button>, e: Event) => void
  cancel: (this: InstanceType<typeof Button>, e: Event) => void
  validateChatName: (
    this: InstanceType<typeof TextField>,
    value: string
  ) => string
}

const props: CreateChatProps = {
  isHide: true,
}
const emits = {
  create: 'CreateChat:create',
  cancel: 'CreateChat:cancel',
}

export const CreateChat = defineHBSComponent({
  name: 'CreateChat',
  renderer,
  emits,
  props,
  components: [TextField, Button, Card],
  data(): CreateChatData {
    return {
      classes,
      chatName: '',
      validateChatName(value) {
        const createChat = this.getParentByName('CreateChat')!
        createChat.data.chatName = value
        createChat.needUpdate = false
        return ''
      },
      create(e) {
        e.stopPropagation()
        e.preventDefault()

        const createChat = this.getParentByName('CreateChat')!
        createChat.emit(emits.create)
      },
      cancel(e) {
        e.stopPropagation()
        e.preventDefault()

        const createChat = this.getParentByName('CreateChat')!
        createChat.emit(emits.cancel)
      },
    }
  },
})
