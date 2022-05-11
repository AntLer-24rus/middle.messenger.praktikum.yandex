import renderer from './chats.hbs'
import classes from './chats.module.scss'
import { defineHBSComponent } from '../../utils'
import ChatList from './components/chats-list'
import ChatView from './components/chat-view'
import { TextField, Icon } from '../../components'

export default defineHBSComponent({
  name: 'Chats',
  renderer,
  props: { classes },
  components: [TextField, Icon, ChatList, ChatView],
  data: () => ({
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
    openSetting(e: Event) {
      e.preventDefault()
      console.log('Open settings')
    },
  }),
})
