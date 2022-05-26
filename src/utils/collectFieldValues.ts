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
    const { inputName, value, validateInput } = tf.data
    const error = validateInput.call(tf)
    data.data[inputName] = value
    if (error) {
      data.valid = false
      data.errors[inputName] = error
    }
  })
  return data
}
