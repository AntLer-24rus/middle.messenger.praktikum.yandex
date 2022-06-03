import renderer from './input.hbs'
import { defineHBSComponent } from '../../../../utils'

type InputPropsType = {
  className: string
  type: 'text' | 'password'
  name: string
  palaceHolder: string
  value: string
  disabled: boolean
}

const props: InputPropsType = {
  className: '',
  type: 'text',
  name: 'input',
  palaceHolder: '',
  value: '',
  disabled: true,
}
const emits = {
  blur: 'Input:blur',
  focus: 'Input:focus',
}

export default defineHBSComponent({
  name: 'Input',
  renderer,
  emits,
  props,
  DOMEvents: {
    blur(e) {
      e.stopPropagation()
      const { value } = e.target as HTMLInputElement
      this.emit(emits.blur, value)
    },
    focus(e) {
      e.stopPropagation()
      const { value } = e.target as HTMLInputElement
      this.emit(emits.focus, value)
    },
  },
})
