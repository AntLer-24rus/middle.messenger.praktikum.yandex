import { Icon, TextField } from '../../components'
import { ChatsResponse } from '../../type/api'
import { defineHBSComponent, HBSComponentInterface } from '../../utils'
import renderer from './chats.hbs'
import classes from './chats.module.scss'
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
  classes: typeof classes
  currentChat: ChatsResponse | undefined
  selectChat(this: InstanceType<typeof ChatsList>, id: number): void
  openSetting(this: InstanceType<typeof Icon>, e: Event): void
  showChatInfoRoot(this: InstanceType<typeof Icon>, e: Event): void
  createChat(this: InstanceType<typeof Icon>, e: Event): void
  sendMessage(this: InstanceType<typeof ChatView>, message: string): void
}
const props: ChatsProps = {
  chats: [],
  messages: [],
}
const emits = {
  showSettings: 'Chats:showSettings',
  showUserList: 'Chats:showUserList',
  createChat: 'Chats:createChat',
  selectChat: 'Chats:selectChat',
  sendMessage: 'Chats:sendMessage',
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
      classes,
      currentChat: undefined,
      selectChat(selectedId) {
        const chats = this.getParentByName('Chats') as InstanceType<
          typeof ChatsPage
        >

        chats.emit(ChatsPage.emits.selectChat, selectedId)
      },
      openSetting(e) {
        e.preventDefault()
        const chats = this.getParentByName('Chats') as InstanceType<
          typeof ChatsPage
        >
        const profile = chats.getChildrenByName(
          'Profile'
        ) as unknown as InstanceType<typeof Profile>
        profile.setProps({ isHide: false })
        chats.emit(emits.showSettings)
      },
      showChatInfoRoot(e) {
        e.preventDefault()
        const chats = this.getParentByName('Chats') as InstanceType<
          typeof ChatsPage
        >
        const userList = chats.getChildrenByName('UserList') as InstanceType<
          typeof UserList
        >
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
      sendMessage(message) {
        const chats = this.getParentByName('Chats') as InstanceType<
          typeof ChatsPage
        >
        chats.emit(emits.sendMessage, message)
      },
    }
  },
})
