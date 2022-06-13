/* eslint no-use-before-define: "off" */
import { defineHBSComponent, HBSComponentInterface } from '../../utils'
import { Input } from './modules/input'
import { Label } from './modules/label'
import renderer from './text-field.hbs'
import classes from './text-field.module.scss'

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
  type: 'text' | 'password'
  validateInput: (this: TextFieldInstance, value?: string) => string
  enter: (this: InstanceType<typeof Input>, value: string) => void
}

export type TextFieldInstance = HBSComponentInterface<
  TextFieldData,
  TextFieldProps
>

const props: TextFieldProps = {
  validate: () => '',
  value: '',
  disabled: false,
  inputName: 'text-filed',
  placeholder: 'введите текст',
  error: '',
}
const emits = {
  enter: 'TextField:enter',
}

export default defineHBSComponent({
  name: 'TextField',
  renderer,
  emits,
  props,
  components: [Input, Label],
  data(): TextFieldData {
    return {
      classes,
      type: this.inputName.toLowerCase().includes('password')
        ? 'password'
        : 'text',
      validateInput(inputValue) {
        const textField = this.getParentByName('TextField') as TextFieldInstance

        const value = inputValue ?? this.data.value
        const error = this.data.validate.call(textField, value)

        const children =
          textField.children as ReadonlyArray<HBSComponentInterface>
        const isErrorLabel = (c: HBSComponentInterface) =>
          c.name === 'Label' && c.data.className?.includes('error')
        const errorLabel = children.find(isErrorLabel)!
        const input = textField.getChildrenByName('Input')!

        textField.data.error = error
        textField.data.value = value
        textField.needUpdate = false
        errorLabel.setProps({ text: error })
        input.setProps({ value })
        return error
      },
      enter(value) {
        const textField = this.getParentByName('TextField') as TextFieldInstance
        textField.data.value = value
        textField.needUpdate = false
        textField.emit(emits.enter, value)
      },
    }
  },
})
