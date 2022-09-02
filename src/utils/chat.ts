import { UserName, localUserInfo } from './user'
import { createSignal } from 'solid-js'

export const [getChatInfos, setChatInfos] = createSignal<ChatInfo[]>([])

export type ChatInfo = UserName &
  ChatRaw & {
    peerId: string
    date: Date
  }

export type ChatRaw = {
  value: string
  chatId: number
}

export const isChatInfo = (data: unknown): data is ChatInfo =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 5 &&
  typeof (data as ChatInfo).userName === 'string' &&
  typeof (data as ChatInfo).chatId === 'number' &&
  typeof (data as ChatInfo).peerId === 'string' &&
  typeof (data as ChatInfo).value === 'string'
// TODO
//  &&
// typeof (data as ChatInfo).date === 'string'

export function localChatInfoFrom(chatRaw: ChatRaw): ChatInfo {
  return {
    userName: localUserInfo().userName,
    chatId: chatRaw.chatId,
    peerId: localUserInfo().peerId,
    value: chatRaw.value,
    date: new Date(),
  }
}
