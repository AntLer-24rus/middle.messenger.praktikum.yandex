import renderer from './input.hbs'
import * as classes from './style.module.scss'
import { defineHBSComponent } from '../../utils'

export default defineHBSComponent({
  name: 'TextField',
  renderer,
  props: {
    validate: (val: string) => '',
    value: '',
    inputName: 'text-filed',
    placeholder: 'введите текст',
    error: '',
  },
  data() {
    return {
      classes,
      //@ts-ignore
      type: this.inputName === 'password' ? 'password' : 'text',
    }
  },
  nativeEvents: {
    inputBlur(e: Event) {
      const input = e.target as HTMLInputElement
      const error = this.validate(input.value)
      this.error = error
      this.value = input.value
    },
    inputFocus(e: Event) {
      const input = e.target as HTMLInputElement
      const error = this.validate(input.value)
      this.error = error
      this.value = input.value
    },
  },
})
