import renderer from './text-field.hbs'
import classes from './text-field.module.scss'
import { defineHBSComponent, last, Component } from '../../utils'
import Input from './modules/input'
import Label from './modules/label'

type TextFieldProps = {
  validate: (val: string) => string
  value: string
  inputName: string
  placeholder: string
  error: string
}
type TextFieldData = {
  classes: typeof classes
  type: string
}

export default defineHBSComponent<TextFieldData, TextFieldProps>({
  name: 'TextField',
  renderer,
  props: {
    validate: (val: string) => '',
    value: '',
    inputName: 'text-filed',
    placeholder: 'введите текст',
    error: '',
  },
  data(this: TextFieldProps) {
    return {
      classes,
      type: this.inputName === 'password' ? 'password' : 'text',
      validateInput(this: Component<TextFieldData & TextFieldProps>, e: Event) {
        const input = e.target as HTMLInputElement
        const error = this.data.validate(input.value)
        const errorLabel = this.parent!.children.find(
          (c) => c.element === input.nextElementSibling
        )
        errorLabel!.setProps({ text: error })
      },
    }
  },
  components: [Input, Label],
  nativeEvents: {
    blur(e: Event) {},
  },
})
