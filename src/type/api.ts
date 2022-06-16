export type SignInRequest = {
  login: string
  password: string
}

export type SignUpRequest = {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export type SignUpResponse = {
  id: number
}

export type UserRequest = {
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  email: string
  phone: string
}

export type UserResponse = {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  email: string
  phone: string
  avatar: string | null
  status: unknown
}

export type ChatsResponse = {
  id: number
  title: string
  avatar: string | null
  unread_count: number
  last_message: {
    user: UserResponse
    time: string
    content: string
  } | null
}

export type ChatUserResponse = Array<
  Omit<UserResponse, 'status'> & {
    role: string
  }
>

export type ChatDeleteResponse = {
  userId: number
  result: ChatsResponse
}

export type BadRequestError = {
  reason: string
}

export type Resource = {
  id: number
  user_id: number
  path: string
  filename: string
  content_type: string
  upload_size: number
  upload_date: string
}

export type ChatsMessagesTokenResponse = {
  token: string
}

export type InstantMessage = {
  id: string
  time: string
  user_id: string
  content: string
  type: 'message'
}

export type OldInstantMessage = {
  chat_id: number
  time: string
  type: string
  user_id: string
  content: string
  file?: {
    id: number
    user_id: number
    path: string
    filename: string
    content_type: string
    content_size: number
    upload_date: string
  }
}
