import renderer from './chats.hbs'
import * as classes from './chats.module.scss'
import { Component, defineHBSComponent } from '../../utils'
import { ChatsList } from './components/chats-list'
import { ChatView } from './components/chat-view'
import { TextField, Icon } from '../../components'
import { UserList } from './components/user-list'
import { Profile } from './components/profile'

type ChatsProps = {
  chats: { name: number }[]
  messages: {
    isSend: boolean
    type: 'income' | 'send'
    text: string
    date: Date
  }[]
}

type ChatsData = {
  classes: typeof classes.default
  openSetting(this: Component<ChatsData, ChatsProps>, e: Event): void
  showChatInfoRoot(this: Component<ChatsData, ChatsProps>, e: Event): void
}
const props: ChatsProps = {
  chats: [
    {
      name: 1,
    },
    {
      name: 2,
    },
    {
      name: 3,
    },
    {
      name: 4,
    },
    {
      name: 4,
    },
    {
      name: 4,
    },
    {
      name: 4,
    },
    {
      name: 4,
    },
    {
      name: 4,
    },
    {
      name: 4,
    },
    {
      name: 4,
    },
  ],
  messages: [
    {
      isSend: false,
      type: 'income',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ipsum, esse ipsam illum aliquid cupiditate voluptates illo tenetur saepe soluta vitae aperiam, debitis dolores natus impedit. Maiores quo sit sequi!',
      date: new Date('2005-08-09T18:31:42'),
    },
    {
      isSend: true,
      type: 'send',
      text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla assumenda magni nobis animi neque impedit eius temporibus, beatae similique minima incidunt distinctio ullam rem necessitatibus odio, fugit qui asperiores soluta architecto. Fuga accusantium totam vel ratione. Perspiciatis quaerat mollitia aspernatur, accusamus ipsa, quibusdam enim maiores laboriosam quia eius facere harum.',
      date: new Date('2005-08-09T18:33:17'),
    },
    {
      isSend: false,
      type: 'income',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ipsum, esse ipsam illum aliquid cupiditate voluptates illo tenetur saepe soluta vitae aperiam, debitis dolores natus impedit. Maiores quo sit sequi!',
      date: new Date('2005-08-09T18:38:23'),
    },
  ],
}
const emits = {}

export default defineHBSComponent({
  name: 'Chats',
  renderer,
  emits,
  props,
  components: [TextField, Icon, ChatsList, ChatView, UserList, Profile],
  data(): ChatsData {
    return {
      classes: classes as unknown as typeof classes.default,
      openSetting(e) {
        e.preventDefault()
        const chats = this.getParentByName('Chats')!
        const profile = chats.getChildrenByName(
          'Profile'
        )! as unknown as InstanceType<typeof Profile>
        profile.setProps({ isHide: false })
      },
      showChatInfoRoot(e) {
        e.preventDefault()
        const chats = this.getParentByName('Chats')!
        const userList = chats.getChildrenByName('UserList')!
        userList.show()
      },
    }
  },
})
