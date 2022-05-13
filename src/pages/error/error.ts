import renderer from './error.hbs'
import * as classes from './error.module.scss'
import { Button, Card } from '../../components'
import { defineHBSComponent } from '../../utils'

export default defineHBSComponent({
  name: 'Error',
  components: [Card, Button],
  renderer,
  props: { classes },
  data: () => ({
    buttonText: 'Назад к чатам',
    buttonType: 'stroke',
    btnClick() {
      global.console.log('Назад к чатам')
    },
  }),
})
