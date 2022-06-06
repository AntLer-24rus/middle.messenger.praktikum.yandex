import type { BadRequestError, UserRequest, UserResponse } from '../type/api'
import { connect, HTTPService } from '../utils'

export class UsersService extends HTTPService {
  static emits = {
    getUserInfo: 'userInfo:emits',
    updateInfo: 'userInfo:emits',
    updatePassword: 'password:emits',
    findUser: 'findUser:emits',
  }

  static listening = {
    updatePassword: 'password:listening',
    findUser: 'findUser:listening',
    updateAvatar: 'avatar:listening',
    updateProfile: 'userInfo:listening',
  }

  constructor() {
    super('https://ya-praktikum.tech/api/v2/user/')

    connect(
      this,
      UsersService.listening.updateAvatar,
      this,
      this.changeCurrentUserAvatar
    )
    connect(
      this,
      UsersService.listening.updateProfile,
      this,
      this.changeCurrentUserProfile
    )
    connect(
      this,
      UsersService.listening.updatePassword,
      this,
      this.changeCurrentUserPassword
    )
    connect(this, UsersService.listening.findUser, this, this.searchUserByLogin)
  }

  changeCurrentUserProfile(userProfile: UserRequest): void {
    this.transport
      .put<UserResponse | BadRequestError>('/profile', { param: userProfile })
      .then(({ status, data, statusText }) => {
        if ('reason' in data) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(UsersService.emits.updateInfo, data)
      })
  }

  changeCurrentUserAvatar(avatarContent: File): void {
    const fd = new FormData()
    fd.append('avatar', avatarContent, avatarContent.name)
    this.transport
      .put<UserResponse | BadRequestError>('/profile/avatar', { param: fd })
      .then(({ status, data, statusText }) => {
        if ('reason' in data) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(UsersService.emits.updateInfo, data)
      })
  }

  changeCurrentUserPassword(passwords: {
    oldPassword: string
    newPassword: string
  }): void {
    this.transport
      .put<undefined | BadRequestError>('/password', { param: passwords })
      .then(({ status, data, statusText }) => {
        if (status >= 400) {
          throw new Error(
            `${status} - ${statusText} (${(data as BadRequestError).reason})`
          )
        }
        this.emit(UsersService.emits.updatePassword)
      })
  }

  getUserById(id: string): void {
    this.transport
      .get<UserResponse | undefined>(`/${id}`)
      .then(({ status, data, statusText }) => {
        if (status >= 400) {
          throw new Error(`${status} - ${statusText}`)
        }
        this.emit(UsersService.emits.findUser, data)
      })
  }

  searchUserByLogin(login: string): void {
    this.transport
      .post<UserResponse | BadRequestError>('/search', { param: { login } })
      .then(({ status, data, statusText }) => {
        if ('reason' in data) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(UsersService.emits.findUser, data)
      })
  }
}
