import { Button, Card } from '../../components'
import { defineHBSComponent } from '../../utils'
import renderer from './error.hbs'
import * as classes from './error.module.scss'

type ErrorProps = {
  code: number
  textError: string
}
type ErrorData = {
  classes: typeof classes.default
  btnClick: (this: InstanceType<typeof Button>) => void
}

const props: ErrorProps = {
  code: 500,
  textError: 'Unknown error',
}
const emits = {
  back: 'Error:back',
}

export const ErrorPage = defineHBSComponent({
  name: 'Error',
  renderer,
  emits,
  props,
  components: [Card, Button],
  data(): ErrorData {
    return {
      classes: classes as unknown as typeof classes.default,
      btnClick() {
        const errorPage = this.getParentByName('Error') as InstanceType<
          typeof ErrorPage
        >
        errorPage.emit(ErrorPage.emits.back)
      },
    }
  },
})
