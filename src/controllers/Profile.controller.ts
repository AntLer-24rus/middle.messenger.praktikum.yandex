import { Card, TextField } from '../components'
import { Profile } from '../pages/chats'
import { PasChange } from '../pages/chats/components/profile/paschange'
import { AuthService, UsersService } from '../services'
import { UserResponse } from '../type/api'
import {
  collectFieldValues,
  connect,
  Controller,
  isEqual,
  Router,
} from '../utils'

type ProfileInstance = InstanceType<typeof Profile>

export class ProfileController extends Controller<ProfileInstance> {
  static listening = {
    ...super.listening,
    exit: 'ProfileController:exit',
    close: 'ProfileController:close',
    userInfo: 'ProfileController:userInfo:listening',
  }

  private _pasChange: InstanceType<typeof PasChange>

  private _authService = new AuthService()

  private _userService = new UsersService()

  constructor(profileComponent: ProfileInstance) {
    super(profileComponent)

    this._pasChange = profileComponent.getChildrenByName(
      'PasChange'
    ) as InstanceType<typeof PasChange>

    connect(
      this,
      ProfileController.listening.userInfo,
      this._authService,
      AuthService.listening.userInfo
    )

    connect(
      this._pasChange,
      PasChange.emits.changePassword,
      this,
      this._changeCurrentUserPassword
    )
    connect(
      this._pasChange,
      PasChange.emits.cancel,
      this,
      this._pasChangeToggle
    )

    connect(
      this.baseComponent,
      Profile.emits.exit,
      this._authService,
      AuthService.listening.logout
    )
    connect(this.baseComponent, Profile.emits.close, this, this._close)
    connect(
      this.baseComponent,
      Profile.emits.editProfile,
      this,
      this._editProfile
    )
    connect(
      this.baseComponent,
      Profile.emits.changeAvatar,
      this,
      this._changeCurrentUserAvatar
    )
    connect(
      this.baseComponent,
      Profile.emits.changePassword,
      this,
      this._pasChangeToggle
    )

    connect(this._authService, AuthService.emits.logout, () => {
      Router.instance().go('/')
    })
    connect(
      this._authService,
      AuthService.emits.userInfo,
      this,
      this._updateUserInfo
    )
    connect(
      this._userService,
      UsersService.emits.updateInfo,
      this,
      this._updateUserInfo
    )

    connect(
      this._userService,
      UsersService.emits.updatePassword,
      this,
      this._updatedPassword
    )
  }

  private _close() {
    const card = this.baseComponent
    const textFields = card.children.filter((c) => c.name === 'TextField')
    textFields.forEach((tf) => {
      tf.setProps({ error: '' })
    })
    this.baseComponent.setProps({ isHide: true, isEdit: false, error: '' })
  }

  private _editProfile() {
    const { isEdit } = this.baseComponent.data
    let { profile } = this.baseComponent.data

    if (isEdit) {
      const card = this.baseComponent.getChildrenByName('Card') as InstanceType<
        typeof Card
      >
      const textFields = card.children.filter(
        (c) => c.name === 'TextField'
      ) as unknown as Array<InstanceType<typeof TextField>>
      const formData = collectFieldValues(textFields)
      if (formData.valid && !isEqual(profile, formData.data)) {
        this._userService.emit(
          UsersService.listening.updateProfile,
          formData.data
        )
      }
      profile = formData.data as typeof profile
    }
    this.baseComponent.setProps({ isEdit: !isEdit, profile })
  }

  private _updateUserInfo(userInfo: UserResponse) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, avatar, status, ...userProfile } = userInfo
    this.baseComponent.setProps({
      profile: userProfile,
      avatar: `https://ya-praktikum.tech/api/v2/resources${avatar}`,
    })
  }

  private _changeCurrentUserAvatar() {
    const tmpInput = document.createElement('input')
    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d')

    // ctx?.drawImage()

    tmpInput.type = 'file'
    tmpInput.multiple = false
    tmpInput.click()
    tmpInput.onchange = (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        const { files } = event.target
        if (files && files.length) {
          this._userService.emit(UsersService.listening.updateAvatar, files[0])
        }
      }
    }
  }

  private _pasChangeToggle() {
    const { isHide } = this._pasChange.data
    this._pasChange.setProps({ isHide: !isHide })
  }

  private _changeCurrentUserPassword() {
    const card = this._pasChange.getChildrenByName('Card') as InstanceType<
      typeof Card
    >
    const textFields = card.children.filter(
      (c) => c.name === 'TextField'
    ) as unknown as Array<InstanceType<typeof TextField>>
    const formData = collectFieldValues(textFields)
    if (formData.valid) {
      this._userService.emit(
        UsersService.listening.updatePassword,
        formData.data
      )
    }
  }

  private _updatedPassword() {
    this._pasChange.setProps({ isHide: true, oldPassword: '', newPassword: '' })
  }
}
