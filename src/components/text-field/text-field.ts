import renderer from './text-field.hbs'
import classes from './text-field.module.scss'
import { defineHBSComponent } from '../../utils'
import Input from './modules/input'

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
      validateInput(e: Event) {
        const input = e.target as HTMLInputElement
        const error = this.data.validate(input.value)
        this.parent.setProps({ error })
      },
    }
  },
  components: [Input],
  nativeEvents: {
    blur(e: Event) {},
  },
})
