import { defineHBSComponent } from '../../../../utils'
import renderer from './input.hbs'

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
  enter: 'Input:enter',
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
    keyup(e) {
      e.stopPropagation()
      if ((e as KeyboardEvent).key === 'Enter') {
        const { value } = e.target as HTMLInputElement
        this.emit(emits.enter, value)
      }
    },
  },
})
