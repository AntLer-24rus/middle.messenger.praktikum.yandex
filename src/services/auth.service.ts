import type {
  BadRequestError,
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
  UserResponse,
} from '../type/api'
import { HTTPService } from '../utils'

export class AuthService extends HTTPService {
  static emits = {
    userInfo: 'AuthService:userInfo:emits',
    signIn: 'AuthService:signin:emits',
    signUp: 'AuthService:signup:emits',
    logout: 'AuthService:logout:emits',
  }

  static listening = {
    userInfo: 'AuthService:userInfo:listening',
    signIn: 'AuthService:signin:listening',
    signUp: 'AuthService:signup:listening',
    logout: 'AuthService:logout:listening',
  }

  constructor() {
    super('https://ya-praktikum.tech/api/v2/auth/')
    this.on(AuthService.listening.userInfo, this.userInfo.bind(this))
    this.on(AuthService.listening.signIn, this.signin.bind(this))
    this.on(AuthService.listening.signUp, this.signup.bind(this))
    this.on(AuthService.listening.logout, this.logout.bind(this))
  }

  userInfo(): void {
    this.transport
      .get<UserResponse | BadRequestError>('/user')
      .then(({ status, data, statusText }) => {
        if ('reason' in data) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(AuthService.emits.userInfo, data)
      })
  }

  signin(authData: SignInRequest): void {
    this.transport
      .post<string | BadRequestError>('/signin', { param: authData })
      .then(({ status, data, statusText }) => {
        if (typeof data !== 'string' && status >= 400) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(AuthService.emits.signIn)
      })
  }

  signup(registrationData: SignUpRequest) {
    this.transport
      .post<SignUpResponse | BadRequestError>('/signup', {
        param: registrationData,
      })
      .then(({ status, data, statusText }) => {
        if ('reason' in data) {
          throw new Error(`${status} - ${statusText} (${data.reason})`)
        }
        this.emit(AuthService.emits.userInfo, data.id)
      })
  }

  logout() {
    this.transport
      .post<string>('/logout')
      .then(({ status, data, statusText }) => {
        if (status >= 400) {
          throw new Error(`${status} - ${statusText}`)
        }
        this.emit(AuthService.emits.logout, data)
      })
  }
}
