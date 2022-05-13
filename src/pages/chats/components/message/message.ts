import renderer from './message.hbs'
import * as classes from './message.module.scss'
import { defineHBSComponent } from '../../../../utils'

type MessageProps = {
  classes: typeof classes.default
  className: string
  isSend: boolean
  date: Date
}

type MessageData = {
  typeClass: string
  formattedDate: (this: MessageData & MessageProps) => string
}

export default defineHBSComponent<MessageData, MessageProps>({
  name: 'Message',
  renderer,
  props: {
    classes: classes as unknown as typeof classes.default,
    className: '1',
    isSend: false,
    date: new Date(),
  },
  data() {
    return {
      typeClass: this.isSend
        ? this.classes.message_send
        : this.classes.message_income,
      formattedDate() {
        return this.date.toLocaleString('ru')
      },
    }
  },
})
