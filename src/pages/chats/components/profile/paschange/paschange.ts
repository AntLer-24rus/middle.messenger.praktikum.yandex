import { Button, Card, Icon, TextField } from '../../../../../components'
import { defineHBSComponent, validator } from '../../../../../utils'
import renderer from './paschange.hbs'
import * as classes from './paschange.module.scss'

type PasChangeProps = {
  isHide: boolean
}

type PasChangeData = {
  classes: typeof classes.default
  oldPassword: string
  newPassword: string
  changePassword: (this: InstanceType<typeof Button>, e: Event) => void
  cancel: (this: InstanceType<typeof Button>, e: Event) => void
  oldPasswordValidator: (
    this: InstanceType<typeof TextField>,
    arg: string
  ) => string
  newPasswordValidator: (
    this: InstanceType<typeof TextField>,
    arg: string
  ) => string
}

const props: PasChangeProps = {
  isHide: true,
}
const emits = {
  changePassword: 'PasChange:changePassword',
  cancel: 'PasChange:cancel',
}

export const PasChange = defineHBSComponent({
  name: 'PasChange',
  renderer,
  emits,
  props,
  components: [Icon, TextField, Button, Card],
  data(): PasChangeData {
    return {
      classes: classes as unknown as typeof classes.default,
      oldPassword: '',
      oldPasswordValidator(v) {
        const pasChange = this.getParentByName('PasChange')!
        pasChange.data.oldPassword = v
        pasChange.data.needUpdate = false

        return validator('password', v)
      },
      newPassword: '',
      newPasswordValidator(v) {
        const pasChange = this.getParentByName('PasChange')!
        pasChange.data.newPassword = v
        pasChange.data.needUpdate = false

        let error = validator('password', v)
        const { newPassword, oldPassword } = pasChange.data
        if (newPassword === oldPassword) {
          error = 'Пароли не должны совпадать'
        }
        return error
      },
      changePassword(e) {
        e.stopPropagation()
        e.preventDefault()

        const pasChange = this.getParentByName('PasChange')!
        pasChange.emit(emits.changePassword)
      },
      cancel(e) {
        e.stopPropagation()
        e.preventDefault()

        const pasChange = this.getParentByName('PasChange')!
        pasChange.emit(emits.cancel)
      },
    }
  },
})
