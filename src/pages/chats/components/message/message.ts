import { defineHBSComponent } from '../../../../utils'
import renderer from './message.hbs'
import classes from './message.module.scss'

type MessageProps = {
  className?: string
  isSend: boolean
  date: Date
}

type MessageData = {
  classes: typeof classes
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
    return {
      classes,
      typeClass: this.isSend ? classes.message_send : classes.message_income,
      formattedDate() {
        return this.date.toLocaleString('ru')
      },
    }
  },
})
