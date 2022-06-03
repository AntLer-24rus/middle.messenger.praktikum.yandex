import renderer from './message.hbs'
import * as classes from './message.module.scss'
import { defineHBSComponent } from '../../../../utils'

type MessageProps = {
  className?: string
  isSend: boolean
  date: Date
}

type MessageData = {
  classes: typeof classes.default
  typeClass: string
  formattedDate: (this: MessageData & MessageProps) => string
}

const props: MessageProps = {
  isSend: false,
  date: new Date(),
}
const emits = {}

export default defineHBSComponent({
  name: 'Message',
  renderer,
  emits,
  props,
  data(): MessageData {
    const cl = classes as unknown as typeof classes.default
    return {
      classes: cl,
      typeClass: this.isSend ? cl.message_send : cl.message_income,
      formattedDate() {
        return this.date.toLocaleString('ru')
      },
    }
  },
})
