type Validator = {
  handler: (val: string) => boolean
  error: string
}

const nameValidators: Validator[] = [
  {
    handler: (val) => !/^[A-ZА-Я]{1}[a-zA-Zа-яА-Я-]*$/gm.test(val),
    error: 'A-z, А-я, первая буква должна быть заглавной',
  },
]

const validatorsGlobal: {
  [key: string]: Validator[]
} = {
  login: [
    {
      handler: (val) => val.length < 3,
      error: 'Логин слишком короткий, от 3х символов',
    },
    {
      handler: (val) => val.length > 20,
      error: 'Логин слишком длинный, до 20ти символов',
    },
    {
      handler: (val) => /^[\d]{3,20}$/gm.test(val),
      error: 'Логин не может состоять только из цифр',
    },
    {
      handler: (val) => !/^[0-9A-z_-]{3,20}$/gm.test(val),
      error: 'Логин должен состоять только из 0-9, A-z, _, -',
    },
  ],
  password: [
    {
      handler: (val) => val.length < 8,
      error: 'Пароль слишком короткий, от 8и символов',
    },
    {
      handler: (val) => val.length > 40,
      error: 'Пароль слишком длинный, до 40ти символов',
    },
    {
      handler: (val) => !/[A-Z]+/gm.test(val),
      error: 'Пароль должен содержать хотя бы одну заглавную букву',
    },
    {
      handler: (val) => !/[0-9]+/gm.test(val),
      error: 'Пароль должен содержать хотя бы цифру',
    },
  ],
  first_name: nameValidators,
  second_name: nameValidators,
  display_name: [
    {
      handler: (val) => !val,
      error: 'Не должно быть пустым',
    },
  ],
  email: [
    {
      handler: (val) => !/^[0-9A-z]+@[0-9A-z]+\..+$/gm.test(val),
      error: 'Не верный формат',
    },
  ],
  phone: [
    {
      handler: (val) => !/^\+?\d{10,15}$/gm.test(val),
      error: 'Неверный формат номера',
    },
  ],
  message: [
    {
      handler: (val) => !!val,
      error: 'Сообщение пустое',
    },
  ],
}

export function validator(fieldName: string, value: string): string {
  const validators = validatorsGlobal[fieldName]
  if (!validators) {
    console.warn(`Неизвестное имя поля ${fieldName}`)
    return ''
  }
  for (const { handler, error } of validators) {
    if (handler(value)) return error
  }
  return ''
}
