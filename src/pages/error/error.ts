import renderer from './error.hbs'
import * as classes from './error.module.scss'
import { Button, Card } from '../../components'
import { Component, defineHBSComponent, Router } from '../../utils'

type ErrorProps = {
  code: number
  textError: string
}
type ErrorData = {
  classes: typeof classes.default
  btnClick: (this: Component<ErrorData, ErrorProps>) => void
}

const props: ErrorProps = {
  code: 500,
  textError: 'Unknown error',
}
const emits = {}

export default defineHBSComponent({
  name: 'Error',
  renderer,
  emits,
  props,
  components: [Card, Button],
  data(): ErrorData {
    return {
      classes: classes as unknown as typeof classes.default,
      btnClick() {
        global.console.log('Назад к чатам')
        Router.instance().back()
      },
    }
  },
})
