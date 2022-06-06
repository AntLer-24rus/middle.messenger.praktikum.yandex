import { TextFieldComp } from '../components'

type FormData = {
  data: Record<string, string>
  valid: boolean
  errors: Record<string, string>
}

export function collectFieldValues(textFields: TextFieldComp[]): FormData {
  const data: FormData = {
    data: {},
    valid: true,
    errors: {},
  }
  textFields.forEach((tf) => {
    let { value } = tf.data
    const { inputName, validateInput } = tf.data

    if (!value) {
      const input = tf.getChildrenByName('Input')?.element as HTMLInputElement
      value = input.value
      tf.setProps({ value })
    }
    const error = validateInput.call(tf)
    data.data[inputName] = value
    if (error) {
      data.valid = false
      data.errors[inputName] = error
    }
  })
  return data
}
