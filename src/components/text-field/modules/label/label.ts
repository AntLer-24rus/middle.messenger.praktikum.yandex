import renderer from './label.hbs'
import { defineHBSComponent } from '../../../../utils'

type LabelProps = {
  inputName: string
  text: string
  className?: string
}

const props: LabelProps = {
  className: 'label',
  inputName: 'input',
  text: 'label',
}
const emits = {}

export default defineHBSComponent({
  name: 'Label',
  renderer,
  emits,
  props,
})
