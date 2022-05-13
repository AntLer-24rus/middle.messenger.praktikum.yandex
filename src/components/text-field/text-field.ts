import renderer from './text-field.hbs'
import * as classes from './text-field.module.scss'
import { defineHBSComponent, Component } from '../../utils'
import { Input } from './modules/input'
import { Label } from './modules/label'

type TextFieldProps = {
  validate: (val: string) => string
  value: string
  disabled: boolean
  inputName: string
  placeholder: string
  error: string
}

type TextFieldData = {
  classes: typeof classes
  type: string
  validateInput: (
    this: Component<TextFieldData & TextFieldProps>,
    value?: string
  ) => string
}

export type TextFieldComp = Component<TextFieldData & TextFieldProps>

export default defineHBSComponent<TextFieldData, TextFieldProps>({
  name: 'TextField',
  renderer,
  props: {
    validate: () => '',
    value: '',
    disabled: false,
    inputName: 'text-filed',
    placeholder: 'введите текст',
    error: '',
  },
  data(this: TextFieldProps) {
    return {
      classes,
      type: this.inputName === 'password' ? 'password' : 'text',
      validateInput(inputValue) {
        const value = inputValue ?? this.data.value
        const error = this.data.validate(value)

        const textField = this.getParentByName('TextField')!
        const errorLabel = textField.children.find(
          (c) => c.name === 'Label' && c.data.className.includes('error')
        )!
        const input = textField.getChildrenByName('Input')!

        textField.data.error = error
        textField.data.value = value
        textField.needUpdate = false
        errorLabel.setProps({ text: error })
        input.setProps({ value })
        return error
      },
    }
  },
  components: [Input, Label],
})
