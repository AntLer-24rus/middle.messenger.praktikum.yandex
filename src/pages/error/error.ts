import renderer from './error.hbs'
import * as classes from './style.module.scss'
import { Button, Card } from '../../components'
import { defineHBSComponent } from '../../utils'

const buttonData = {
  text: 'Назад к чатам',
  type: 'stroke',
}

export default defineHBSComponent({
  name: 'Error',
  components: [Card, Button],
  renderer,
  props: { classes },
  data: () => ({
    buttonText: 'Назад к чатам',
    buttonType: 'stroke',
    btnClick(e: Event) {
      console.log('Назад к чатам')
    },
  }),
})
