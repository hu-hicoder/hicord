import { UserName, localUserInfo } from './user'
import { createSignal } from 'solid-js'
import { BoxInfo } from './box'

export const [getChatInfos, setChatInfos] = createSignal<ChatInfo[]>([])
export const [getChatBoxInfos, setChatBoxInfos] = createSignal<ChatBoxInfo[]>([
  {
    id: 1,
    chatGroup: 0,
    x: 2048,
    y: 2048,
    deg: 0,
    width: 300,
    height: 300,
  },
])

export type ChatInfo = UserName &
  ChatRaw & {
    peerId: string
    date: Date
  }

export type ChatRaw = ChatGroup & {
  value: string
}

export type ChatGroup = {
  chatGroup: number
}

export type ChatBoxInfo = ChatGroup &
  BoxInfo & {
    id: number
  }

export const isChatInfo = (data: unknown): data is ChatInfo =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 5 &&
  typeof (data as ChatInfo).userName === 'string' &&
  typeof (data as ChatInfo).chatGroup === 'number' &&
  typeof (data as ChatInfo).peerId === 'string' &&
  typeof (data as ChatInfo).value === 'string'
// TODO
//  &&
// typeof (data as ChatInfo).date === 'string'

export function localChatInfoFrom(chatRaw: ChatRaw): ChatInfo {
  return {
    userName: localUserInfo().userName,
    chatGroup: chatRaw.chatGroup,
    peerId: localUserInfo().peerId,
    value: chatRaw.value,
    date: new Date(),
  }
}
