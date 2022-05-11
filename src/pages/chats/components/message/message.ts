import renderer from './message.hbs'
import classes from './message.module.scss'
import { defineHBSComponent } from '../../../../utils'

type MessageProps = {
  classes: typeof classes
  className: string
  isSend: boolean
  date: Date
}

type MessageData = {
  typeClass: string
  formattedDate: () => string
}

export default defineHBSComponent<MessageData, MessageProps>({
  name: 'Message',
  renderer,
  props: { classes, className: '1', isSend: false, date: new Date() },
  data(this: MessageProps) {
    return {
      typeClass: this.isSend ? classes.message_send : classes.message_income,
      formattedDate(this: MessageProps & MessageData) {
        return this.date.toLocaleString('ru')
      },
    }
  },
})
