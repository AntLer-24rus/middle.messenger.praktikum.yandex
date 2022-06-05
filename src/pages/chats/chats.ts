import { Icon, TextField } from '../../components'
import { ChatsResponse } from '../../type/api'
import { defineHBSComponent, HBSComponentInterface } from '../../utils'
import renderer from './chats.hbs'
import * as classes from './chats.module.scss'
import { ChatView } from './components/chat-view'
import { ChatsList } from './components/chats-list'
import { CreateChat } from './components/create-chat'
import { Profile } from './components/profile'
import { UserList } from './components/user-list'

type ChatsProps = {
  chats: ChatsResponse[]
  messages: {
    isSend: boolean
    type: 'income' | 'send'
    text: string
    date: Date
  }[]
}

type ChatsData = {
  classes: typeof classes.default
  currentChat: ChatsResponse | undefined
  selectChat(this: InstanceType<typeof ChatsList>, id: number): void
  openSetting(this: InstanceType<typeof Icon>, e: Event): void
  showChatInfoRoot(this: InstanceType<typeof Icon>, e: Event): void
  createChat(this: InstanceType<typeof Icon>, e: Event): void
}
const props: ChatsProps = {
  chats: [],
  messages: [],
}
const emits = {
  showSettings: 'Chats:showSettings',
  showUserList: 'Chats:showUserList',
  createChat: 'Chats:createChat',
}

export type ChatsPageInstance = HBSComponentInterface<ChatsData, ChatsProps>

export const ChatsPage = defineHBSComponent({
  name: 'Chats',
  renderer,
  emits,
  props,
  components: [
    TextField,
    Icon,
    ChatsList,
    ChatView,
    UserList,
    Profile,
    CreateChat,
  ],
  data(): ChatsData {
    return {
      classes: classes as unknown as typeof classes.default,
      currentChat: undefined,
      selectChat(selectedId) {
        const chats = this.getParentByName('Chats')! as InstanceType<
          typeof ChatsPage
        >
        const currentChat = chats.data.chats.find(({ id }) => id === selectedId)
        chats.setProps({ currentChat })
      },
      openSetting(e) {
        e.preventDefault()
        const chats = this.getParentByName('Chats')!
        const profile = chats.getChildrenByName(
          'Profile'
        )! as unknown as InstanceType<typeof Profile>
        profile.setProps({ isHide: false })
        chats.emit(emits.showSettings)
      },
      showChatInfoRoot(e) {
        e.preventDefault()
        const chats = this.getParentByName('Chats') as InstanceType<
          typeof ChatsPage
        >
        const userList = chats.getChildrenByName('UserList')!
        userList.setProps({ isHide: false })
        chats.emit(emits.showUserList, chats.data.currentChat?.id)
      },
      createChat(e) {
        e.preventDefault()
        e.stopPropagation()
        const chats = this.getParentByName('Chats') as InstanceType<
          typeof ChatsPage
        >
        chats.emit(emits.createChat)
      },
    }
  },
})
